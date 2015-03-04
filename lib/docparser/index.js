var esprima = require('esprima');
var _ = require('underscore');
var util = require('util');
var common = require('../common');

function getExamples(contents) {
  var tree = esprima.parse(contents, { attachComment: true, loc: true });

  var codeExamples = [];

  _.each(tree.body, function(topLevelExpression) {
    if (topLevelExpression.type === 'FunctionDeclaration' &&
        topLevelExpression.leadingComments) {
      // function MyFunc() {}
      _.each(topLevelExpression.leadingComments, function(comment) {
        var examples = parseComment(comment.value);
        _.each(examples, function(example) {
          codeExamples.push({
            contents: example,
            line: topLevelExpression.loc.start.line,
            unit: topLevelExpression.id.name
          });
        });
      });
    } else if (topLevelExpression.type === 'ExpressionStatement' &&
      topLevelExpression.expression.type === 'AssignmentExpression' &&
      topLevelExpression.leadingComments) {
      // MyFunc.prototype.foo = function() {}
      _.each(topLevelExpression.leadingComments, function(comment) {
        var examples = parseComment(comment.value);
        _.each(examples, function(example) {
          var lhs = topLevelExpression.expression.left;
          codeExamples.push({
            contents: example,
            line: topLevelExpression.loc.start.line,
            unit: contents.substring(lhs.range[0], lhs.range[1])
          });
        });
      });
    }
  });

  //console.log(JSON.stringify(tree.body, null, '  '));
  return codeExamples;
}

function parseComment(comment) {
  comment = common.trimEachLine(comment.trim());
  var codeExamples = [];
  var lines = comment.split('\n');
  var curExample = null;

  _.each(lines, function(line) {
    if (line.indexOf('```') === 0) {
      if (curExample !== null) {
        codeExamples.push(curExample);
        curExample = null;
      } else {
        curExample = '';
      }
    } else if (curExample !== null) {
      curExample += line + '\n';
    }
  });

  return codeExamples;
}

module.exports = {
  getExamples: getExamples
};