'use strict';

const acquit = require('../');
const assert = require('assert');

describe('Examples', function() {
  let logged = [];
  const console = {
    logged: [],
    log: function() {
      console.logged.push(Array.prototype.slice.call(arguments));
    }
  };

  beforeEach(function() {
    logged = [];
  });

  it('require', function() {
    const fs = require('fs');
    const transform = require('acquit-require');

    const markdown = fs.readFileSync('./test/sample.md').toString();
    const examples = fs.readFileSync('./test/example.js').toString();

    const output = transform(markdown, acquit.parse(examples));

    // `[require:foo]` and `[require:bar]` are replaced with the
    // corresponding tests in `example.js`
    console.log(output);
    // acquit:ignore:start
    let logStatements = output.match(/console\.log(.*);/g);
    assert.ok(logStatements);
    assert.equal(logStatements[0].trim(), `console.log('Hello, World!');`);
    assert.equal(logStatements[1].trim(), `console.log('Bye!');`);

    assert.equal(console.logged.length, 1);

    const _output = console.logged[0][0];
    logStatements = _output.match(/console\.log(.*);/g);
    assert.ok(logStatements);
    assert.equal(logStatements[0].trim(), `console.log('Hello, World!');`);
    assert.equal(logStatements[1].trim(), `console.log('Bye!');`);
    // acquit:ignore:end
  });
});
