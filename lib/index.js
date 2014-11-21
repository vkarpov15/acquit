var esprima = require('esprima');
var _ = require('underscore');
var util = require('util');
var marked = require('marked');

var parse = function(contents) {
  var tree = esprima.parse(contents, { attachComment: true });

  var visitorFactory = function() {
    var ret = {};

    ret.result = {};

    ret.visit = function(node, parent, context) {
      if (node.type === 'CallExpression' &&
          node.callee &&
          node.callee.name === 'describe' &&
          node.arguments &&
          node.arguments.length) {
        var block = {
          type: 'describe',
          contents: node.arguments[0].value,
          blocks: [],
          comments: _.pluck(node.callee.leadingComments || [], 'value')
        };
        context.push(block);
        return block.blocks;
      } else if (node.type === 'CallExpression' &&
          node.callee &&
          node.callee.name === 'it' &&
          node.arguments &&
          node.arguments.length) {
        var block = {
          type: 'it',
          contents: node.arguments[0].value,
          comments: _.pluck(node.callee.leadingComments || [], 'value'),
          code: contents.substring(node.arguments[1].body.range[0] + 1, node.arguments[1].body.range[1] - 1)
        };
        context.push(block);
        // Once we've reached an 'it' block, no need to go further
        return null;
      }

      return context;
    };

    return ret;
  };

  var recurse = function(node, parent, context, visitor) {
    if (node instanceof Array || node instanceof Object) {
      var newContext = visitor.visit(node, parent, context);
      if (!newContext) {
        return;
      }

      _.each(node, function(child) {
        recurse(child, node, newContext, visitor);
      });
    }
  };

  var ret = [];
  var visitor = visitorFactory();

  recurse(tree, null, ret, visitor);

  return ret;
};

module.exports = {
  parse: parse,
  trimEachLine: function(str) {
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
  }
};
