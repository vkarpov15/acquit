var esprima = require('esprima');
var _ = require('underscore');
var util = require('util');
var marked = require('marked');
var jade = require('jade');
var fs = require("fs");
var html2jade = require("html2jade");

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

var format = function(header_no, block){
  console.log(block)
  var full_string = "";
  if (block.contents){
    var id = block.contents.split(' ').join("-");
    full_string += util.format("<h%s class=\"contents\" id=\"%s\">%s %s</h%s>", header_no, id, block.type, block.contents, header_no);
  }
  if (block.comments[0]){
    console.log(block.comments);
    var comments = block.comments[0];
    comments = comments.replace(/\n/g,"");
    comments = comments.replace(/\*/g,"");
    comments = "<p class=\"comments\">" + comments + "</p>"
    full_string += comments
}
  if (block.code){
    var code = block.code;
    code = marked(code);
    full_string += util.format("<p class=\"code\">%s</p>", code)
  }
  return full_string;
};

var generateHTML = function(data){
  var des = []
    , header = 1;

  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
  });

  var convert = function(block, current_header) {
    if (block.type == "describe") {
      des.push(format(current_header, block));
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
      des.push(format(current_header, block));
      return;

    }
  };

  _.each(data, function(doc){
    header = 1;
    convert(doc, header);
  });

  html =  des.join(" ")
  return html;
}


module.exports.parse = parse;
module.exports.generateHTML = generateHTML;
