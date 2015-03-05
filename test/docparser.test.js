var docparser = require('../lib/docparser');
var fs = require('fs');
var assert = require('assert');

describe('docparser', function(done) {
  var content;

  before(function(done) {
    fs.readFile('./test/docparser.sample.js', function(err, c) {
      if (err) {
        return done(err);
      }
      content = c.toString();
      done();
    });
  });

  it('pulls comments from source code', function(done) {
    comments = docparser.getExamples(content);
    var code = 'var conn = new NativeConnection();\n' +
      'assert.deepEqual([\'good\', \'bad\'], conn.STATES);\n';
    var obj = {
      'NativeConnection.prototype.STATES': [{
        contents: code,
        line: 32
      }]
    };
    assert.equal(Object.keys(comments).length, 1);
    assert.equal(comments['NativeConnection.prototype.STATES'].length, 1);
    assert.equal(comments['NativeConnection.prototype.STATES'][0].contents, code);
    assert.equal(comments['NativeConnection.prototype.STATES'][0].line, 32);
    assert.deepEqual(obj, comments);
    done();
  });

  /*it('runs mocha tests', function(done) {
    var config = {
      setup: 'var assert = require("assert");\nvar NativeConnection = require("test/docparser.sample.js");\n',
      eachTest: function(example) {
        return 'it("", function() {\n' + example + '\n})';
      }
    };

    var code = 'var conn = new NativeConnection();\n' +
      'assert.deepEqual([\'good\', \'bad\'], conn.STATES);\n';
    var obj = {
      contents: code,
      line: 33,
      unit: 'NativeConnection.prototype.STATES'
    };

    console.log('Running examples');
    docparser.runExamples(config, [obj]);
    console.log('done');
    done();
  });*/
});
