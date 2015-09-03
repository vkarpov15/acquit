var acquit = require('./lib');
var fs = require('fs');

var md = fs.readFileSync('./HEADER.md');
md += '\n';

var blocks = acquit.parse(fs.readFileSync('./test/test.js').toString());

for (var i = 0; i < blocks.length; ++i) {
  var block = blocks[i];
  md += '## ' + block.contents.trim() + '\n\n';
  for (var j = 0; j < block.blocks.length; ++j) {
    var it = block.blocks[j];
    md += '#### It ' + it.contents.trim() + '\n\n';
    if (it.comments.length) {
      md += acquit.trimEachLine(it.comments[0]).trim() + '\n\n';
    }
    md += '```javascript\n';
    md += '    ' + it.code + '\n';
    md += '```\n\n';
  }
}

require('fs').writeFileSync('./README.md', md);
