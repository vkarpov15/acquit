'use strict';

var esprima = require('esprima');
var formatCode = require('./formatCode');

module.exports = function(transforms, contents, cb) {
  if (cb && !(typeof cb === 'function')) {
    throw Error('Second parameter must be a function.');
  }

  var tree = esprima.parseModule(contents, { attachComment: true, range: true });

  var visitorFactory = function() {
    var ret = {};

    ret.result = {};
    var existingRanges = [];
    var blockFns = ['it', 'specify'];

    ret.visit = function(node, parent, context) {
      if (node.type === 'ExpressionStatement' &&
          get(node, 'expression.type') === 'CallExpression' &&
          (get(node, 'expression.callee.name') === 'describe' || get(node, 'expression.callee.name') === 'context') &&
          get(node, 'expression.arguments.length', 0) > 0) {
        var block = {
          type: 'describe',
          contents: node.expression.arguments[0].value,
          blocks: [],
          comments: takeRight((node.leadingComments || []).map(v => v.value))
        };
        context.push(block);
        return block.blocks;
      } else if (node.type === 'ExpressionStatement' &&
          get(node, 'expression.type') === 'CallExpression' &&
          blockFns.indexOf(get(node, 'expression.callee.name')) !== -1 &&
          get(node, 'expression.arguments.length', 0) > 1) {
        // Weird but esprima sometimes treats the last comment in a previous
        // `it()` block as a leading comment for the next `it()` block, so
        // filter out comments that are in other `it()` blocks.
        var _comments = existingRanges.length === 0 ?
          node.leadingComments :
          (node.leadingComments || []).filter(c => c.range[0] > last(existingRanges)[1]);
        existingRanges.push(node.range);
        var block = {
          type: 'it',
          contents: node.expression.arguments[0].value,
          comments: (_comments || []).map(v => v.value),
          code: formatCode(contents.substring(node.expression.arguments[1].body.range[0] + 1, node.expression.arguments[1].body.range[1] - 1))
        };

        for (var i = 0; i < transforms.length; ++i) {
          transforms[i](block);
        }

        if (typeof cb !== 'undefined') {
          cb(block);
        }
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

      Object.keys(node).forEach(function(key) {
        var child = node[key];
        recurse(child, node, newContext, visitor);
      });
    }
  };

  var ret = [];
  var visitor = visitorFactory();

  recurse(tree, null, ret, visitor);

  return ret;
};

function takeRight(arr) {
  return arr.slice(arr.length - 1);
}

function get(obj, prop) {
  var p = prop.split('.');
  for (var i = 0; i < p.length; ++i) {
    if (obj == null) {
      return null;
    }
    obj = obj[p[i]];
  }

  return obj;
}

function last(arr) {
  return arr[arr.length - 1];
}
