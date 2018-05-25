const fs = require('fs');
const highlight = require('highlight.js');
const marked = require('marked');

const highlightJS = code => highlight.highlight('JavaScript', code).value;
marked.setOptions({ highlight: highlightJS });

const md = fs.readFileSync('./docs/plugins.md').toString();

module.exports = () => `
  <div class="container">
    <link rel="stylesheet" href="/docs/github.css">
    ${marked(md)}
  </div>
`.trim();
