'use strict';

const whitespaceOnly = /^\s*$/;

/**
 * Because test code may be deeply nested underneath a bunch of
 * `describe()` and `it()`, you get a lot of gnarly whitespace.
 *
 * Before: https://i.imgur.com/8HEuApw.png
 * After: https://i.imgur.com/RZs3yag.png
 *
 * @param {string} code
 * @returns {string} reformatted code
 */

module.exports = function formatCode(code) {
  let lines = code.split('\n');
  lines = removeLeadingBlanks(lines);
  lines = removeTrailingBlanks(lines);
  const numCharsToRemove = minimumIndent(lines);

  for (let i = 0; i < lines.length; ++i) {
    if (!whitespaceOnly.test(lines[i])) {
      lines[i] = lines[i].substr(numCharsToRemove);
    }
  }

  return lines.join('\n');
};

function removeLeadingBlanks(lines) {
  for (let i = 0; i < lines.length; ++i) {
    if (!whitespaceOnly.test(lines[i])) {
      // Found first non-blank line
      return lines.slice(i);
    }
  }

  return [];
}

function removeTrailingBlanks(lines) {
  for (let i = lines.length - 1; i >= 0; --i) {
    if (!whitespaceOnly.test(lines[i])) {
      // Found last non-blank line
      return lines.slice(0, i + 1);
    }
  }

  return [];
}

function minimumIndent(lines) {
  return lines
    .filter(line => !whitespaceOnly.test(line))
    .reduce((minIndent, line) => {
      if (minIndent == null) {
        return numLeadingWhitespace(line);
      }
      return Math.min(minIndent, numLeadingWhitespace(line));
    }, null);
}

function numLeadingWhitespace(str) {
  for (let i = 0; i < str.length; ++i) {
    if (!whitespaceOnly.test(str.charAt(i))) {
      return i;
    }
  }
}
