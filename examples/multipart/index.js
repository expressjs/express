
/**
 * Module dependencies.
 */

var express = require('../..')
  , format = require('util').format;

var app = module.exports = express()

// bodyParser in connect 2.x uses node-formidable to parse 
// the multipart form data.
app.use(express.bodyParser())

app.get('/', function(req, res){
  res.send('<form method="post" enctype="multipart/form-data">'
    + '<p>Title: <input type="text" name="title" /></p>'
    + '<p>Image: <input type="file" name="image" /></p>'
    + '<p><input type="submit" value="Upload" /></p>'
    + '</form>');
});

app.post('/', function(req, res, next){
  // the uploaded file can be found as `req.files.image` and the
  // title field as `req.body.title`
  res.send(format('\nuploaded %s (%d Kb) to %s as %s'
    , req.files.image.name
    , req.files.image.size / 1024 | 0 
    , req.files.image.path
    , req.body.title));
});

if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}