
var fs= require('fs')
var jade = require('jade')
var hl = require('./docs/helpers/highlight')
var linktype = require('./docs/helpers/linktype')
var href = require('./docs/helpers/href')
var klass = require('./docs/helpers/klass')
var package = require('./package')
var bddDox = require('./lib');
var _ = require('underscore');

// add custom jade filters
require('./docs/helpers/filters')(jade);


//have it open a new file with a different name but use the index.jade as the template, and the docs.html as the place
//where the html is rendered.
var jadeify = function (filename, doc_filepath, options) {
  options || (options = {});
  options.package = package;
  options.hl = hl;
  options.linktype = linktype;
  options.href = href;
  options.klass = klass;
  var fullpath = doc_filepath + "/" + filename;
  var jade_file = filename.replace('.html', '.jade');
  fs.writeFile(doc_filepath + "/" + jade_file, 'extends layout \nblock content\n    include ' + filename, function(err){
    jade.renderFile(doc_filepath + "/" + jade_file, options, function (err, str) {
      if (err) return console.error(err.stack);
      fs.writeFile(fullpath, str, function (err) {
        if (err) return console.error('could not write', err.stack);
        console.log('%s : rendered ', new Date, fullpath);
      });
    });
  });
};

var generateTestDocs = function(test_filepath, doc_filepath, options){
  // find all the files
  fs.readdir(test_filepath, function(err, files){
    _.each(files, function(file){
      if (file.split('.')[1] == 'js') {
        // create the file? or
        var render_name = file.replace('.js', '.html');
        var contents = fs.readFileSync(test_filepath + '/' + file).toString();
        var ret = bddDox.parse(contents);
        var toHTML = bddDox.generateHTML(ret);
        fs.unlink(doc_filepath + '/docs.html', function (err) {
          fs.writeFile(doc_filepath + '/' + render_name, toHTML, function (err) {
            jadeify(render_name, doc_filepath);
          });

        });

      }
    });
  });
  // generate documentation
  // jadeify it


};

module.exports.generateTestDocs = generateTestDocs;

