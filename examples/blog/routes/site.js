
/**
 * Module dependencies.
 */

var Post = require('../models/post');

app.get('/', function(req, res){
  Post.count(function(err, count){
    Post.all(function(err, posts){
      res.render('index', {
          count: count
        , posts: posts
      });
    });
  });
});
