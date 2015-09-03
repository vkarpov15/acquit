var parse = require('./parse');
var trimEachLine = require('./trimEachLine');
var _ = require('underscore');

'use strict';

var transforms = [];

module.exports = Acquit;

function Acquit() {
  if (!(this instanceof Acquit)) {
    return new Acquit();
  }

  var _transforms = [].concat(transforms);

  this.parse = function(contents, callback) {
    return parse(_transforms, contents, callback);
  };

  this.getTransforms = function() {
    return _transforms;
  };

  this.removeAllTransforms = function() {
    _transforms = [];
  };

  this.transform = function(callback) {
    _transforms.push(callback);
  };

  this.trimEachLine = trimEachLine;
}

var funcs = {
  getTransforms: function() {
    return transforms;
  },
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

_.each(funcs, function(value, key) {
  Acquit[key] = value;
});
