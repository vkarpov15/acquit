var _ = require('lodash');
var esprima = require('esprima');
var formatCode = require('./formatCode');
var marked = require('marked');
var util = require('util');

module.exports = function(transforms, contents, cb) {
  if (cb && !(typeof cb === 'function')) {
    throw Error('Second parameter must be a function.');
  }

  var tree = esprima.parse(contents, { attachComment: true, range: true });

  var visitorFactory = function() {
    var ret = {};

    ret.result = {};
    var existingRanges = [];
    var blockFns = ['it', 'specify'];

    ret.visit = function(node, parent, context) {
      if (node.type === 'ExpressionStatement' &&
          _.get(node, 'expression.type') === 'CallExpression' &&
          (_.get(node, 'expression.callee.name') === 'describe' || _.get(node, 'expression.callee.name') === 'context') &&
          _.get(node, 'expression.arguments.length', 0) > 0) {
        var block = {
          type: 'describe',
          contents: node.expression.arguments[0].value,
          blocks: [],
          comments: _.takeRight(_.map(node.leadingComments || [], 'value'))
        };
        context.push(block);
        return block.blocks;
      } else if (node.type === 'ExpressionStatement' &&
          _.get(node, 'expression.type') === 'CallExpression' &&
          blockFns.indexOf(_.get(node, 'expression.callee.name')) !== -1 &&
          _.get(node, 'expression.arguments.length', 0) > 1) {
        // Weird but esprima sometimes treats the last comment in a previous
        // `it()` block as a leading comment for the next `it()` block, so
        // filter out comments that are in other `it()` blocks.
        var _comments = existingRanges.length === 0 ?
          node.leadingComments :
          (node.leadingComments || []).filter(c => c.range[0] > _.last(existingRanges)[1]);
        existingRanges.push(node.range);
        var block = {
          type: 'it',
          contents: node.expression.arguments[0].value,
          comments: _.map(_comments || [], 'value'),
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
