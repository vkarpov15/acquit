# acquit

Parse BDD-style tests (Mocha, Jasmine) to generate documentation

[![Build Status](https://travis-ci.org/vkarpov15/acquit.svg?branch=master)](https://travis-ci.org/vkarpov15/acquit)
[![Coverage Status](https://coveralls.io/repos/vkarpov15/acquit/badge.svg?branch=master&service=github)](https://coveralls.io/github/vkarpov15/acquit?branch=master)

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

#### It can call user function on `code` block and save return value

Acquit can also take a callback as second parameter. This callback gets
executed on every block and can transform the block however you want.

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

#### It can define transforms

Want to chain multiple callbacks together and/or develop re-usable
plugins? `acquit.transform()` allows you to add transformations that
are executed each time you call `.parse()`.

Transform functions are executed in order **before** the callback
function passed to `.parse()`.

```javascript
    
    var contents =
      'describe(\'ES6\', function() {\n' +
      '  // ES6 has a `yield` keyword\n' +
      '  it(\'should be able to yield\', function() {\n' +
      '    // some code\n' +
      '  });\n' +
      '});';

    var cb = function(block) {
      block.code = 'my transformed code';
    };

    acquit.transform(cb);

    var ret = acquit.parse(contents);

    assert.equal('my transformed code', ret[0].blocks[0].code);
    acquit.removeAllTransforms();
  
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

## Output processors

#### It can transform acquit output

You can use the `.output()` function to attach output processors,
which transform the output from `acquit.parse()` before you get it.

```javascript
    
    var contents = [
      'describe("My feature", function() {',
      '  it("works", function() {',
      '    // some code',
      '  });',
      '});'
    ].join('\n');

    acquit.output(function(res) {
      return [
        '# ' + res[0].contents,
        '\n',
        '## ' + res[0].blocks[0].contents
      ].join('\n');
    });

    var res = acquit.parse(contents);

    assert.equal(res, [
      '# My feature',
      '\n',
      '## works'
    ].join('\n'));
    acquit.removeAllTransforms();
  
```

## `acquit()` constructor

#### It creates a new instance with its own set of transforms

You can also use acquit as a constructor, in case you need
multiple sets of transforms.

```javascript
    
    acquit.transform(function(block) {});
    assert.equal(acquit.getTransforms().length, 1);

    var parser = acquit();
    assert.equal(parser.getTransforms().length, 1);

    parser.transform(function(block) {});
    assert.equal(parser.getTransforms().length, 2);

    parser.removeAllTransforms();
    assert.equal(parser.getTransforms().length, 0);
    assert.equal(acquit.getTransforms().length, 1);

    assert.equal(parser.parse('describe("test", function() {});').length,
      1);

    parser.output(function(res) {
      return 'myFakeOutput';
    });

    assert.equal(parser.parse('describe("test", function() {});'),
      'myFakeOutput');

    parser.removeAllOutputProcessors();

    assert.equal(parser.parse('describe("test", function() {});').length,
      1);
  
```

