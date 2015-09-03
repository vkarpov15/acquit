module.exports = function(str) {
  var lines = str.split('\n');
  var result = '';
  for (var i = 0; i < lines.length; ++i) {
    var toAdd = lines[i].trim();
    if (toAdd.indexOf('*') === 0) {
      toAdd = toAdd.substr('*'.length).trim();
    }
    result += (i > 0 ? '\n' : '') + toAdd;
  }

  return result;
};
