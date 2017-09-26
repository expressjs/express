/**
 * Module dependencies.
 */

const escapeHtml = require('escape-html');
const express = require('../..');
const fs = require('fs');
const marked = require('marked');
const path = require('path');

const app = module.exports = express();

// register .md as an engine in express view system

app.engine('md',(path, options, fn) => {
  fs.readFile(path, 'utf8', function(err, str){
    if (err) return fn(err);
    var html = marked.parse(str).replace(/\{([^}]+)\}/g, function(_, name){
      return escapeHtml(options[name] || '');
    });
    fn(null, html);
  });
});

app.set('views', path.join(__dirname, 'views'));

// make it the default so we dont need .md
app.set('view engine', 'md');

app.get('/',(req, res) => {
  res.render('index', { title: 'Markdown Example' });
});

app.get('/fail',(req, res) => {
  res.render('missing', { title: 'Markdown Example' });
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
