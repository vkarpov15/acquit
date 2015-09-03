var parse = require('./parse');
var trimEachLine = require('./trimEachLine');

var transforms = [];

module.exports = {
  parse: function(contents, callback) {
    return parse(transforms, contents, callback);
  },
  removeAllTransforms: function() {
    transforms = [];
  },
  transform: function(callback) {
    transforms.push(callback);
  },
  trimEachLine: trimEachLine
};
