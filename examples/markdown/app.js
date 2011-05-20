
/**
 * Module dependencies.
 */

var express = require('../../lib/express')
  , md = require('node-markdown').Markdown;

var app = express.createServer();

// register .md so that markdown may comply
// with the express view system by implementing
// a .compile() method

app.register('.md', {
  compile: function(str, options){
    var html = md(str);
    return function(locals){
      return html.replace(/\{([^}]+)\}/g, function(_, name){
        return locals[name];
      });
    };
  }
});

// Optional since express defaults to CWD/views

app.set('views', __dirname + '/views');
app.set('view engine', 'md');

app.get('/', function(req, res){
  res.render('index', { layout: false, title: 'Markdown Example' });
});

app.listen(3000);
console.log('Express app started on port 3000');