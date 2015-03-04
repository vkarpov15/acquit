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
    var obj = {
      contents: 'var a = b;\n',
      line: 30,
      unit: 'NativeConnection.prototype.STATES'
    };
    assert.deepEqual([obj], comments);
    done();
  });
});