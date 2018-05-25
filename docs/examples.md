## Importing Examples From Tests

The [acquit-require plugin](https://www.npmjs.com/package/acquit-require)
handles dereferencing examples from your HTML or markdown. Drop in
`[require:regexp$]` and the plugin will replace that with the
first test case it can find that ends with 'regexp'.

Given the below `sample.md`:

```
{markdown}
```

And the below `example.js` test file:

```javascript
{example}
```

The below code will replace `[require:bar]` and `[require:baz]` with the
code of the corresponding tests from `example.js`.

```javascript
[require:require]
```

Below is the transformed markdown.

```
{compiledMarkdown}
```

## Transpiling Tests into Markdown

The [acquit-markdown plugin](https://www.npmjs.com/package/acquit-markdown) lets you
compile your existing tests into markdown. If you already have
well-commented tests, this plugin will convert those into a GitHub
`README.md` for you. The acquit-markdown plugin [uses itself to generate its own `README`](https://github.com/vkarpov15/acquit-markdown/blob/master/docs.js).

You can [use acquit-markdown from Node.js](https://www.npmjs.com/package/acquit-markdown#it-converts-acquit-output-to-a-simple-markdown-format), or as an executable from the command line. To install:

```
npm install acquit acquit-markdown
```

Say you have a test file `example.js` as shown below.

```
{example}
```

You can run the `acquit-markdown` executable to compile this test
file into markdown.

```
./node_modules/.bin/acquit-markdown -p ./test/example.js > README.md
```

`README.md` will now contain the below markdown.

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
