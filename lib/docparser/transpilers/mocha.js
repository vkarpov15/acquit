var _ = require('underscore');

function MochaTranspiler(config, examples) {
  var _this = this;
  this._mochaCode = config.setup + '\n';
  _.each(examples, function(examplesList, name) {
    _this._mochaCode += 'describe("' + name + '", function() {\n';
    _.each(examplesList, function(example, index) {
      _this._mochaCode += 'it("' + index + '", function() {\n';
      _this._mochaCode += example.contents;
      _this._mochaCode += '});\n';
    });
    _this._mochaCode += '});\n';
  });
}

MochaTranspiler.prototype.getCode = function() {
  return this._mochaCode;
}

module.exports = MochaTranspiler;
