/**
 * Module dependencies.
 */

var express = require('../..');
var multiparty = require('multiparty');
var format = require('util').format;

var app = module.exports = express();

app.get('/', function(req, res){
  res.send('<form method="post" enctype="multipart/form-data">'
    + '<p>Title: <input type="text" name="title" /></p>'
    + '<p>Image: <input type="file" name="image" /></p>'
    + '<p><input type="submit" value="Upload" /></p>'
    + '</form>');
});

app.post('/', function(req, res, next){
  // create a form to begin parsing
  var form = new multiparty.Form();
  var image;
  var title;

  form.on('error', next);
  form.on('close', function(){
    res.send(format('\nuploaded %s (%d Kb) as %s'
      , image.filename
      , image.size / 1024 | 0
      , title));
  });

  // listen on field event for title
  form.on('field', function(name, val){
    if (name !== 'title') return;
    title = val;
  });

  // listen on part event for image file
  form.on('part', function(part){
    if (!part.filename) return;
    if (part.name !== 'image') return part.resume();
    image = {};
    image.filename = part.filename;
    image.size = 0;
    part.on('data', function(buf){
      image.size += buf.length;
    });
  });


  // parse the form
  form.parse(req);
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(4000);
  console.log('Express started on port 4000');
}
