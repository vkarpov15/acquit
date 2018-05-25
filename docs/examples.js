const acquit = require('../');
const fs = require('fs');
const highlight = require('highlight.js');
const marked = require('marked');
const transform = require('acquit-require');

require('acquit-ignore')(acquit);

const highlightJS = code => highlight.highlight('JavaScript', code).value;
marked.setOptions({ highlight: highlightJS });

const examples = fs.
  readFileSync(`${__dirname}/../test/examples.test.js`).
  toString();

const md = transform(fs.readFileSync('./docs/examples.md').toString(),
  acquit.parse(examples));

const exampleMarkdown = fs.readFileSync('./test/sample.md').toString().trim();
const exampleTest = fs.readFileSync('./test/example.js').toString().trim();

module.exports = props => {
  const content = marked(md).
    replace(/{markdown}/g, exampleMarkdown).
    replace(/{example}/g, highlightJS(exampleTest)).
    replace(/{compiledMarkdown}/g, transform(exampleMarkdown, acquit.parse(exampleTest)));
  return `
  <div class="container">
    <link rel="stylesheet" href="/docs/github.css">
    ${content}
  </div>
  `.trim();
}
