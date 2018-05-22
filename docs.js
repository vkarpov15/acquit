'use strict';

const acquit = require('./lib');
const fs = require('fs');

/*require('acquit-markdown')(acquit);

let md = fs.readFileSync('./HEADER.md');
md += '\n';

md += acquit.parse(fs.readFileSync('./test/test.js').toString());

require('fs').writeFileSync('./README.md', md);*/

const layout = require('./docs/layout');

const props = { version: require('./package').version };
const pages = [
  { file: 'index.html', content: require('./docs/home')(props) }
];

for (const page of pages) {
  fs.writeFileSync(page.file, layout(Object.assign({}, props, page)));
}
