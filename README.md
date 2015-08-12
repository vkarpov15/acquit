# acquit

Parse BDD-style tests (Mocha, Jasmine) to generate documentation

[![Build Status](https://travis-ci.org/vkarpov15/acquit.svg?branch=master)](https://travis-ci.org/vkarpov15/acquit)

## `acquit.parse()`

#### It can parse Mocha tests into `blocks`

Acquit's `parse()` function takes in mocha tests as a string, and outputs
a list of "blocks", which are either `describe` or `it` calls. A `describe`
call contains a list of "blocks", whereas an `it` call contains the actual
`code` in order to provide an effective, well-tested example.

```javascript

    var contents =
      '/**\n' +
      ' * A `Model` is a convenience wrapper around objects stored in a\n' +
      ' * collection\n' +
      ' */\n' +
      'describe(\'Model\', function() {\n' +
      '  /**\n' +
      '   * Model **should** be able to save stuff\n' +
      '   **/\n' +
      '  it(\'can save\', function() {\n' +
      '    assert.ok(1);\n' +
      '  });\n' +
      '\n' +
      '  it(\'can save with a parameter\', function() {\n' +
      '  });\n' +
      '});';

    var ret = acquit.parse(contents);

    // One top-level block: describe('Model')
    assert.equal(1, ret.length);
    assert.equal('describe', ret[0].type);
    assert.equal(1, ret[0].comments.length);
    assert.ok(ret[0].comments[0].indexOf('`Model`') != -1);

    // Top-level block contains the `it('can save')` block, which contains
    // the code
    assert.equal(2, ret[0].blocks.length);
    assert.equal('it', ret[0].blocks[0].type);
    assert.equal(1, ret[0].blocks[0].comments.length);
    assert.ok(ret[0].blocks[0].code.indexOf('assert.ok(1)') !== -1);
    assert.equal('can save', ret[0].blocks[0].contents);

    assert.equal('it', ret[0].blocks[1].type);
    assert.equal('can save with a parameter', ret[0].blocks[1].contents);
    assert.equal(0, ret[0].blocks[1].comments.length);

```

#### Acquit can also take a callback as second parameter

```javascript
    var contents =
    'describe(\'ES6\', function() {\n' +
    '  // ES6 has a `yield` keyword\n' +
    '  it(\'should be able to yield\', function() {\n' +
    '    // some code\n' +
    '  });\n' +
    '});';

    var cb = function(block) {
    block.code = 'return value from callback';
    };

    var ret = acquit.parse(contents, cb);

    assert.equal('return value from callback', ret[0].blocks[0].code);
```

#### It can parse the ES6 `yield` keyword

Acquit can also parse ES6 code

```javascript

    var contents =
      'describe(\'ES6\', function() {\n' +
      '  // ES6 has a `yield` keyword\n' +
      '  it(\'should be able to yield\', function() {\n' +
      '    co(function*() {\n' +
      '      yield 1;\n' +
      '    })();\n' +
      '  });\n' +
      '});';

    var ret = acquit.parse(contents);

    assert.equal(1, ret.length);
    assert.equal('describe', ret[0].type);
    assert.equal(0, ret[0].comments.length);
    assert.equal(1, ret[0].blocks.length);
    assert.equal('it', ret[0].blocks[0].type);
    assert.equal(1, ret[0].blocks[0].comments.length);
    assert.ok(ret[0].blocks[0].code);

```

## `acquit.trimEachLine()`

#### It strips out whitespace and asterisks in multiline comments

`trimEachLine()` is a helper function for trimming whitespace and asterisks
from JSdoc-style comments

```javascript

    var str = '  * This comment looks like a \n' +
      '  * parsed JSdoc-style comment';

    assert.equal(acquit.trimEachLine(str), 'This comment looks like a\n' +
      'parsed JSdoc-style comment');

```

#### It strips out whitespace and asterisks in multiline comments

You don't have to use JSdoc-style comments: `trimEachLine()` also trims
leading and trailing whitespace.

```javascript

    var str = 'This comment looks like a \n' +
      '  * parsed JSdoc-style comment';

    assert.equal(acquit.trimEachLine(str), 'This comment looks like a\n' +
      'parsed JSdoc-style comment');

```
