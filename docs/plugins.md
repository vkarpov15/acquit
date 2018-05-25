## Runnable Plugins

#### [`acquit-require`](https://www.npmjs.com/package/acquit-require)

Dereference `[require:<regexp>]` statements in your markdown or HTML
and replace them with the source code of the first test that matches
`<regexp>`.

Given `sample.md`:

    # JS for Beginners

    Printing "Hello, World" in JavaScript is easy:

    ```
    [require:bar]
    ```

    This is how you print "Bye!" instead:

    ```
    [require:baz]
    ```

And `example.js`:

```javascript
describe('foo', function() {
  it('bar', function() {
    console.log('Hello, World!');
  });

  it('baz', function() {
    console.log('Bye!');
  });
});
```

`acquit-require` replaces `[require:bar]` and `[require:baz]` with
the source code of the 'bar' and 'baz' tests from `example.js`.

    # JS for Beginners

    Printing "Hello, World" in JavaScript is easy:

    ```
    console.log('Hello, World!');
    ```

    This is how you print "Bye!" instead:

    ```
    console.log('Hello, World!');
    ```

#### [`acquit-markdown`](https://www.npmjs.com/package/acquit-markdown)

The `acquit-markdown` compiles test files into markdown, including
comments. Say you have a test file `example.js` as shown below.

```javascript
describe('foo', function() {
  /* This is how you print "Hello, World!" in JavaScript */
  it('bar', function() {
    console.log('Hello, World!');
  });

  // You can print any string
  it('baz', function() {
    console.log('Bye!');
  });
});
```

`acquit-markdown` compiles this file into the below markdown:

    # foo

    ## It bar

    This is how you print "Hello, World!" in JavaScript

    ```javascript
    console.log('Hello, World!');
    ```

    ## It baz

    You can print any string

    ```javascript
    console.log('Bye!');
    ```

## Utility Plugins

#### [`acquit-ignore`](https://www.npmjs.com/package/acquit-ignore)

Remove asserts, `done()`, and other unnecessary boilerplate from your examples.

```javascript
describe('foo', function() {
  // `acquit-ignore` will strip out all code between
  // `// acquit:ignore:start` and `// acquit:ignore:end`
  it('bar', function(done) {
    console.log('Hello, World!');
    // acquit:ignore:start
    done();
    // acquit:ignore:end
  });
});
```

You can use `acquit-ignore` programmatically:

```javascript
const acquit = require('acquit');
require('acquit-ignore')();
```

You can also use it with the `acquit-markdown` executable using the
`-r` flag.

```
./node_modules/.bin/acquit-markdown -r acquit-ignore -p ./test/example.js > README.md
```
