## Importing Examples From Tests

The [acquit-require plugin](https://www.npmjs.com/package/acquit-require)
handles dereferencing examples from your HTML or markdown. Drop in
`[require:regexp$]` and the plugin will replace that with the
first test case it can find that ends with 'regexp'.

Given the below `sample.md`:

```
[markdown]
```

And the below `example.js` test file:

```javascript
[example]
```

The below code will replace `[require:bar]` and `[require:baz]` with the
code of the corresponding tests from `example.js`.

```javascript
[require:require]
```

Below is the transformed markdown.

```
[compiledMarkdown]
```

## Transpiling Tests into Markdown

The [acquit-markdown plugin](https://www.npmjs.com/package/acquit-markdown) lets you
compile your existing tests into markdown. If you already have
well-commented tests, this plugin will convert those into a GitHub
`README.md` for you. The acquit-markdown plugin [uses itself to generate its own `README`](https://github.com/vkarpov15/acquit-markdown/blob/master/docs.js).
