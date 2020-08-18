var assert = require('assert');
var acquit = require('../lib');

describe('acquit:unit', function() {
  it('throws if second arg is not a function', function() {
    assert.throws(function() {
      acquit.parse('abc', 'not a function');
    });
  });

  it('handles trailing comments', function() {
    var ret = acquit.parse(`
      it('test 1', function() {
        assert.equal('A', 'A');
        // Trail comment
      });

      /* Header comment */
      it('test 2', function() {
        assert.equal('A', 'A');
      });
    `);

    assert.equal(ret.length, 2);
    assert.equal(ret[1].comments.length, 1);
    assert.equal(ret[1].comments[0].trim(), 'Header comment');
  });

  it('handles import statements', function() {
    const ret = acquit.parse(`
      import foo from 'bar';

      it('test 1', function() { assert.equal('A', 'A'); });
    `);

    assert.equal(ret.length, 1);
  });
});
