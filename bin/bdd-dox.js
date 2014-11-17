var commander = require('commander');
var fs = require('fs');

commander.
  option('-p, --path [path]', 'File/directory to use').
  parse(process.argv);

if (!commander.path) {
  throw 'Need to set --path!';
}

var contents = fs.readFileSync(commander.path).toString();

var bddDox = require('./lib');
var ret = bddDox(contents);

console.log(JSON.stringify(ret, null, 2));
