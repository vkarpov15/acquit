var esprima = require('esprima');
var _ = require('underscore');
var util = require('util');
var md = require('markdown').markdown;

var Parse = function(contents) {
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

var format = function(header_no, contents, comments, code){
  full_string = "";
  if (contents){
    full_string += util.format("<h%s>%s</h%s>", header_no, contents, header_no);
  }
  if (comments){
    comments = comments[0];
    comments.replace("\n","");
    comments = md.toHTML(comments);
    full_string += comments
  }
  if (code){
    full_string += util.format("<p>%s</p>", code)
  }
  return full_string;
};

var generateDocs = function(data){
  var des = []
    , header = 1;

  var convert = function(block, current_header) {
    if (block.type == "describe") {
      des.push(format(current_header, block.contents, block.comments));
      if (block.blocks) {
        _.each(block.blocks, function (b) {
          convert(b, current_header + 1);
        })
      }
      else {
        return;
      }
    }
    else if (block.type == "it") {
      des.push(format(current_header, block.contents, block.comments, block.code));
      return;

    }
  };

  convert(data[0], header);

  return des.join("\n");




}

module.exports.parse = Parse;
module.exports.generate = generateDocs;
