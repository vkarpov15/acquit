'use strict';

const acquit = require('./lib');
const fs = require('fs');

// Website
const layout = require('./docs/layout');

const props = { version: require('./package').version };
const pages = [
  {
    path: 'index.html',
    content: require('./docs/home')(props),
    subtitle: 'Parse BDD tests to generate documentation'
  },
  {
    path: 'docs/examples.html',
    content: require('./docs/examples')(props),
    subtitle: 'Examples'
  },
  {
    path: 'docs/plugins.html',
    content: require('./docs/plugins')(props),
    subtitle: 'Plugins'
  }
];

for (const page of pages) {
  fs.writeFileSync(page.path, layout(Object.assign({}, props, page)));
}

// README
require('acquit-markdown')(acquit);

let md = fs.readFileSync('./HEADER.md');
md += '\n';

md += acquit.parse(fs.readFileSync('./test/main.test.js').toString());

fs.writeFileSync('./README.md', md);
