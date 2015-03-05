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

  it('compiles mocha tests', function(done) {
    var config = {
      executable: 'mocha',
      setup: 'var assert = require("assert");\nvar NativeConnection = require("./test/docparser.sample.js");\n',
    };

    var code = 'var conn = new NativeConnection();\n' +
      'assert.deepEqual([\'good\', \'bad\'], conn.STATES);\n';
    var obj = {
      'NativeConnection.prototype.STATES': [{
        contents: code,
        line: 32
      }]
    };

    var transpiler = docparser.compileExamples(config, obj);
    var lines = transpiler.getCode().split('\n');

    var expected =
      ['var assert = require("assert");',
      'var NativeConnection = require("./test/docparser.sample.js");',
      '',
      'describe("NativeConnection.prototype.STATES", function() {',
      'it("0", function() {',
      'var conn = new NativeConnection();',
      'assert.deepEqual([\'good\', \'bad\'], conn.STATES);',
      '});',
      '});',
      ''];

    assert.equal(expected[0], lines[0]);
    assert.equal(expected[1], lines[1]);
    assert.equal(expected[2], lines[2]);
    assert.equal(expected[3], lines[3]);
    assert.equal(expected[4], lines[4]);
    assert.equal(expected[5], lines[5]);
    assert.equal(expected[6], lines[6]);
    assert.equal(expected[7], lines[7]);
    assert.equal(expected[8], lines[8]);
    assert.equal(expected[9], lines[9]);
    assert.equal(10, lines.length);
    done();
  });
});
