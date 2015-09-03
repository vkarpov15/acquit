var assert = require('assert');
var acquit = require('../lib');

describe('acquit:unit', function() {
  it('throws if second arg is not a function', function() {
    assert.throws(function() {
      acquit.parse('abc', 'not a function');
    });
  });
});
