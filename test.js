var assert = require('assert');
var fs = require('fs');
var bddDox = require('./lib');

describe('Basic functionality', function() {
  it('can provide basic results', function() {
    var contents = fs.readFileSync('./test/data/sample.js').toString();

    var ret = bddDox(contents);

    assert.equal(1, ret.length);
    assert.equal('describe', ret[0].type);
    assert.equal(1, ret[0].blocks.length);
    assert.equal('it', ret[0].blocks[0].type);
    assert.equal(1, ret[0].blocks[0].comments.length);
    assert.ok(ret[0].blocks[0].code);
  });
});
