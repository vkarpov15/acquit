var esprima = require('esprima');
var _ = require('underscore');
var util = require('util');
var common = require('../common');
var transpilers = require('./transpilers');

/**
 * getExamples(contents)
 *
 * @param {String} contents The JavaScript code as a string
 * @returns {Array} codeExamples A list of Markdown-formatted code examples
 * @api public
 */
function getExamples(contents) {
  var tree = esprima.parse(contents, { attachComment: true, loc: true });

  var codeExamples = {};

  _.each(tree.body, function(topLevelExpression) {
    if (topLevelExpression.type === 'FunctionDeclaration' &&
        topLevelExpression.leadingComments) {
      // Parse statements like `function MyFunc() {}`
      _.each(topLevelExpression.leadingComments, function(comment) {
        var examples = parseComment(comment.value);
        codeExamples[topLevelExpression.id.name] = [];
        _.each(examples, function(example) {
          codeExamples[topLevelExpression.id.name].push({
            contents: example,
            line: topLevelExpression.loc.start.line
          });
        });
      });
    } else if (topLevelExpression.type === 'ExpressionStatement' &&
      topLevelExpression.expression.type === 'AssignmentExpression' &&
      topLevelExpression.leadingComments) {
      // Parse statements like `MyFunc.prototype.foo = function() {}`
      _.each(topLevelExpression.leadingComments, function(comment) {
        var examples = parseComment(comment.value);
        var lhs = topLevelExpression.expression.left;
        codeExamples[contents.substring(lhs.range[0], lhs.range[1])] = [];
        _.each(examples, function(example) {
          codeExamples[contents.substring(lhs.range[0], lhs.range[1])].push({
            contents: example,
            line: topLevelExpression.loc.start.line
          });
        });
      });
    }
  });

  //console.log(JSON.stringify(tree.body, null, '  '));
  return codeExamples;
}

function compileExamples(config, examples) {
  var executable = config.executable;
  if (executable === 'mocha') {
    return new transpilers.mocha(config, examples);
  }
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

function compile(config, contents) {
  return compileExamples(config, getExamples(contents));
}

module.exports = {
  getExamples: getExamples,
  compileExamples: compileExamples,
  compile: compile
};
