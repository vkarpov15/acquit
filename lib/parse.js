'use strict';

var espree = require('espree');
var formatCode = require('./formatCode');

module.exports = function(transforms, contents, cb) {
  if (cb && !(typeof cb === 'function')) {
    throw Error('Second parameter must be a function.');
  }

  var tree = espree.parse(contents, { comment: true , range: true, ecmaVersion: "latest", sourceType: "module" });

  var visitorFactory = function() {
    var ret = {};

    ret.result = {};
    var existingRanges = [];
    var existingDescribeRanges = [];
    var blockFns = ['it', 'specify'];

    ret.visit = function(node, parent, context) {
      if (node.type === 'ExpressionStatement' &&
          get(node, 'expression.type') === 'CallExpression' &&
          (get(node, 'expression.callee.name') === 'describe' || get(node, 'expression.callee.name') === 'context') &&
          get(node, 'expression.arguments.length', 0) > 0) {
        var _comments = getComments(existingRanges, existingDescribeRanges, tree, node.range, 'describe');
        existingDescribeRanges.push(node.range);
        var block = {
          type: 'describe',
          contents: node.expression.arguments[0].value,
          blocks: [],
          comments: _comments.map(v => v.value)
        };
        context.push(block);
        return block.blocks;
      } else if (node.type === 'ExpressionStatement' &&
          get(node, 'expression.type') === 'CallExpression' &&
          blockFns.indexOf(get(node, 'expression.callee.name')) !== -1 &&
          get(node, 'expression.arguments.length', 0) > 1) {
        var _comments = getComments(existingRanges, existingDescribeRanges, tree, node.range, 'it');
        existingRanges.push(node.range);
        var block = {
          type: 'it',
          contents: node.expression.arguments[0].value,
          comments: _comments.map(v => v.value),
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

/**
 * Get all comments within range for the given block
 * @param {[[number, number]]} existingRanges The inner block ranges
 * @param {[[number, number]]} existingDescribeRanges The describe block ranges
 * @param {*} tree The tree where the comments are on
 * @param {[number, number]} range The range of the current node
 * @param {"describe" | "it"} type The type to get comments for
 * @returns {[string]} The filtered comments
 */
function getComments(existingRanges, existingDescribeRanges, tree, range, type) {
  if (!tree.comments || tree.comments.length === 0) {
    return [];
  }

  var lastRange;

  if (type === "describe") {
    // for "describe" block comments, only use describe block ranges
    lastRange = last(existingDescribeRanges) || [0, 0];
  } else if (type === "it") {
    // for "it"(or inner) block's, use last inner range
    // OR use last describe block's beginning and only the beginning
    // OR if the last describe block's beginning is higher than the last inner block,
    // use describe block's beginning
    lastRange = last(existingRanges);
    var lastDescribe = last(existingDescribeRanges) || [0, 0];
    if (!lastRange || lastRange[1] < lastDescribe[0]) {
      lastRange = [lastDescribe[0], lastDescribe[0]];
    }
  } else {
    throw new Error('Unknown type "'+type+'"');
  }

  return tree.comments.filter(c => {
    var commentBegin = c.range[0];
    var commentEnd = c.range[1];
    return commentBegin > lastRange[1] && commentEnd < range[0];
  })
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
