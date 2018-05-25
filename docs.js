'use strict';

const acquit = require('./lib');
const fs = require('fs');

require('acquit-markdown')(acquit);

let md = fs.readFileSync('./HEADER.md');
md += '\n';

md += acquit.parse(fs.readFileSync('./test/test.js').toString());

require('fs').writeFileSync('./README.md', md);

const layout = require('./docs/layout');

const props = { version: require('./package').version };
const pages = [
  { path: 'index.html', content: require('./docs/home')(props) },
  { path: 'docs/examples.html', content: require('./docs/examples')(props) },
  /*{ path: 'docs.html', content: require('./docs/docs')(props) },
  { path: 'plugins.html', content: require('./docs/plugins')(props) }*/
];

for (const page of pages) {
  fs.writeFileSync(page.path, layout(Object.assign({}, props, page)));
}
