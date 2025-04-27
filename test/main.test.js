var assert = require('assert');
var acquit = require('../lib');

describe('`acquit.parse()`', function() {
  /**
   * Acquit's `parse()` function takes in mocha tests as a string, and outputs
   * a list of "blocks", which are either `describe` or `it` calls. A `describe`
   * call contains a list of "blocks", whereas an `it` call contains the actual
   * `code` in order to provide an effective, well-tested example. */
  it('can parse Mocha tests into `blocks`', function() {
    var contents = `
      /**
       * A Model is a convenience wrapper around objects stored in a
       * collection
       */
      describe('Model', function() {
        /**
         * Model **should** be able to save
         **/
         it('can save', function() {
           assert.ok(1);
         });

         it('can save with a parameter', function() {
         });
      });
    `;

    var ret = acquit.parse(contents);

    // One top-level block: describe('Model')
    assert.equal(1, ret.length);
    assert.equal('describe', ret[0].type);
    assert.equal(1, ret[0].comments.length);
    assert.ok(ret[0].comments[0].indexOf('convenience') != -1);

    // Top-level block contains the `it('can save')` block, which contains
    // the code
    assert.equal(2, ret[0].blocks.length);
    assert.equal('it', ret[0].blocks[0].type);
    assert.equal(1, ret[0].blocks[0].comments.length);
    assert.ok(ret[0].blocks[0].comments[0].indexOf('**should**') != -1);
    assert.ok(ret[0].blocks[0].code.indexOf('assert.ok(1)') !== -1);
    assert.equal('can save', ret[0].blocks[0].contents);

    assert.equal('it', ret[0].blocks[1].type);
    assert.equal('can save with a parameter', ret[0].blocks[1].contents);
    assert.equal(0, ret[0].blocks[1].comments.length);
  });

  /**
   * Acquit can also take a callback as second parameter. This callback gets
   * executed on every block and can transform the block however you want.
   */
  it('can call user function on `code` block and save return value', function() {
    var contents = `
      describe('ES6', function() {
        // ES6 has a yield keyword
        it(\'should be able to yield\', function() {
         // some code
       });
      });
    `;

    var cb = function(block) {
      block.code = 'return value from callback';
    };

    var ret = acquit.parse(contents, cb);

    assert.equal('return value from callback', ret[0].blocks[0].code);
  });

  /**
   * Want to chain multiple callbacks together and/or develop re-usable
   * plugins? `acquit.transform()` allows you to add transformations that
   * are executed each time you call `.parse()`.
   *
   * Transform functions are executed in order **before** the callback
   * function passed to `.parse()`.
   */
  it('can define transforms', function() {
    var contents = `
      describe('ES6', function() {
        // ES6 has a yield keyword
        it('should be able to yield', function() {
          // some code
        });
      });
    `;

    var cb = function(block) {
      block.code = 'my transformed code';
    };

    acquit.transform(cb);

    var ret = acquit.parse(contents);

    assert.equal('my transformed code', ret[0].blocks[0].code);
    acquit.removeAllTransforms();
  });

  /**
   * Acquit can also parse ES6 code
   */
  it('can parse the ES6 `yield` keyword', function() {
    var contents = `
      describe('ES6', function() {
        // ES6 has a yield keyword
        it('should be able to yield', function() {
          co(function*() {
            yield 1;
          })();
        });
      });
    `;

    var ret = acquit.parse(contents);

    assert.equal(1, ret.length);
    assert.equal('describe', ret[0].type);
    assert.equal(0, ret[0].comments.length);
    assert.equal(1, ret[0].blocks.length);
    assert.equal('it', ret[0].blocks[0].type);
    assert.equal(1, ret[0].blocks[0].comments.length);
    assert.ok(ret[0].blocks[0].code);
  });

  /**
   * Acquit can parse Mocha alias:
   *  - `context` = `describe`
   *  - `specify` = `it`
   */
  it('can parse Mocha\'s `context()` and `specify()`', function() {
    var contents = `
      context('Mocha aliases', function() {
        specify('should be parsed', function() {
          assert.equal(1, 1);
        });
      });
    `;

    var ret = acquit.parse(contents);

    assert.equal(1, ret.length);
    assert.equal('describe', ret[0].type);
    assert.equal(0, ret[0].comments.length);
    assert.equal(1, ret[0].blocks.length);
    assert.equal('it', ret[0].blocks[0].type);
    assert.equal(0, ret[0].blocks[0].comments.length);
    assert.ok(ret[0].blocks[0].code);
  });

  // https://github.com/vkarpov15/acquit/issues/30
  it('does not carry comments from last describe block to next', function() {
    var contents = `
    // this is fine
describe('first', () => {
  it('hello', () => {
    assert(1 == 1);
    // some random last comment
  });
});

describe('second', () => {
  it('another', () => {
    assert(2 == 2);
  });
});

describe('third', () => {
  it('final', () => {
    assert(3 == 3);
  });
});
    `

    var ret = acquit.parse(contents);

    assert.equal(ret.length, 3);

    assert.equal(ret[0].comments.length, 1);
    assert.equal(ret[0].comments[0], " this is fine");
    assert.equal(ret[0].blocks[0].comments.length, 0);

    assert.equal(ret[1].comments.length, 0);
    assert.equal(ret[1].blocks[0].comments.length, 0);

    assert.equal(ret[2].comments.length, 0);
    assert.equal(ret[2].blocks[0].comments.length, 0);
  })

  it('supports spread operator', function() {
    var contents = `
    const obj = {
  name: "My Object"
};

it("should parse spread syntax", async () => {
  const newObj = { key: { ...obj, newKey: "newValue" } };
});`;

    var ret = acquit.parse(contents);

    assert.equal(ret.length, 1);

    assert.equal(ret[0].type, "it");
    assert.equal(ret[0].contents, "should parse spread syntax");
  })
});

describe('`acquit.trimEachLine()`', function() {
  /**
   * `trimEachLine()` is a helper function for trimming whitespace and asterisks
   * from JSdoc-style comments */
  it('strips out whitespace and asterisks in multiline comments', function() {
    var str = `  * This comment looks like a
      * parsed JSdoc-style comment`;

    assert.equal(acquit.trimEachLine(str), 'This comment looks like a\n' +
      'parsed JSdoc-style comment');
  });

  /**
   * You don't have to use JSdoc-style comments: `trimEachLine()` also trims
   * leading and trailing whitespace. */
  it('strips out whitespace and asterisks in multiline comments', function() {
    var str = `This comment looks like a
        * parsed JSdoc-style comment`;

    assert.equal(acquit.trimEachLine(str), 'This comment looks like a\n' +
      'parsed JSdoc-style comment');
  });
});

describe('Output processors', function() {
  afterEach(function() {
    acquit.removeAllTransforms();
    acquit.removeAllOutputProcessors();
  });

  /**
   * You can use the `.output()` function to attach output processors,
   * which transform the output from `acquit.parse()` before you get it.
   */
  it('can transform acquit output', function() {
    var contents = `
      describe("My feature", function() {
        it("works", function() {
          // some code
        });
      });
    `;

    acquit.output(function(res) {
      return `
        # ${res[0].contents}

        ## ${res[0].blocks[0].contents}
      `;
    });

    var res = acquit.parse(contents);

    assert.equal(res.trim(), `
        # My feature

        ## works
    `.trim());
    acquit.removeAllTransforms();
  });
});

describe('`acquit()` constructor', function() {
  /**
   * You can also use acquit as a constructor, in case you need
   * multiple sets of transforms.
   */
  it('creates a new instance with its own set of transforms', function() {
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
  });
});
