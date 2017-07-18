var parse = require('./parse');
var trimEachLine = require('./trimEachLine');
var _ = require('lodash');

var transforms = [];
var outputProcessors = [];

module.exports = Acquit;

function Acquit() {
  if (!(this instanceof Acquit)) {
    return new Acquit();
  }

  var _transforms = [].concat(transforms);
  var _outputProcessors = [].concat(outputProcessors);

  this.parse = function(contents, callback) {
    return applyOutputProcessors(_outputProcessors,
      parse(_transforms, contents, callback));
  };

  this.getTransforms = function() {
    return _transforms;
  };

  this.output = function(output) {
    _outputProcessors.push(output);
    return this;
  }

  this.removeAllTransforms = function() {
    _transforms = [];
    return this;
  };

  this.removeAllOutputProcessors = function() {
    _outputProcessors = [];
    return this;
  };

  this.transform = function(callback) {
    _transforms.push(callback);
    return this;
  };

  this.trimEachLine = trimEachLine;
}

var funcs = {
  getTransforms: function() {
    return transforms;
  },
  output: function(output) {
    outputProcessors.push(output);
    return this;
  },
  parse: function(contents, callback) {
    return applyOutputProcessors(outputProcessors,
      parse(transforms, contents, callback));
  },
  removeAllOutputProcessors: function() {
    outputProcessors = [];
    return this;
  },
  removeAllTransforms: function() {
    transforms = [];
    return this;
  },
  transform: function(callback) {
    transforms.push(callback);
    return this;
  },
  trimEachLine: trimEachLine
};

_.each(funcs, function(value, key) {
  Acquit[key] = function() {
    return value.apply(Acquit, arguments);
  };
});

function applyOutputProcessors(processors, output) {
  for (var i = 0; i < processors.length; ++i) {
    output = processors[i](output);
  }
  return output;
}
