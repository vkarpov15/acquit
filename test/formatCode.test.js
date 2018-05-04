'use strict';

const assert = require('assert');
const formatCode = require('../lib/formatCode');

describe('formatCode()', function() {
  it('strips whitespace', function() {
    // Nasty whitespace, `console.log()` is indented 6 spaces
    const code = `
      console.log('Hello, World!');
    `;
    assert.equal(formatCode(code), `console.log('Hello, World!');`);
  });

  it('preserves formatting with multi line', function() {
    // Nasty whitespace, `console.log()` is indented 6 spaces
    const code = `
      for (let i = 0; i < 3; ++i) {
        console.log('Hello, World!');
      }
    `;
    assert.equal(formatCode(code), [
      `for (let i = 0; i < 3; ++i) {`,
      `  console.log('Hello, World!');`,
      `}`
    ].join('\n'));
  });
});
