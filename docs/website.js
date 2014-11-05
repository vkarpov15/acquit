
var fs= require('fs')
var jade = require('jade')
var hl = require('./helpers/highlight')
var linktype = require('./helpers/linktype')
var href = require('./helpers/href')
var klass = require('./helpers/klass')
var package = require('../package')

// add custom jade filters
require('./helpers/filters')(jade);


function jadeify (filename, options) {
  options || (options = {});
  options.package = package;
  options.hl = hl;
  options.linktype = linktype;
  options.href = href;
  options.klass = klass;
  jade.renderFile(filename, options, function (err, str) {
    if (err) return console.error(err.stack);

    var newfile = filename.replace('.jade', '.html')
    fs.writeFile(newfile, str, function (err) {
      if (err) return console.error('could not write', err.stack);
      console.log('%s : rendered ', new Date, newfile);
    });
  });
}

jadeify("./index.jade");