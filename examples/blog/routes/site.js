
/**
 * Module dependencies.
 */

var Post = require('../models/post');

app.get('/', function(req, res){
  Post.count(function(err, count){
    res.render('index', { count: count });
  });
});
