
/**
 * Module dependencies.
 */

var basicAuth = require('../../../lib/express').basicAuth
  , Post = require('../models/post');

/**
 * Apply basic auth to all post related routes
 */

app.all('/post/*', basicAuth(function(user, pass){
  return 'admin' == user && 'express' == pass;
}));

/**
 * Map :post to the database.
 */

// app.param('post', function(req, res, next, id){
//   Post.get(id, function(err, post){
//     if (err) return next(err);
//     if (!post) return next(new Error('failed to find user ' + id));
//     req.post = post;
//     next();
//   });
// });

/**
 * Add a post.
 */

app.get('/post/add', function(req, res){
  res.render('post/form', { post: {}});
});

/**
 * Save a post.
 */

app.post('/post', function(req, res){
  var data = req.body.post
    , post = new Post(data.title, data.body);
  post.save(function(err){
    res.redirect('/post/' + post.id);
  });
});

app.get('/post/:post', function(req, res){
  console.log(req.post);
});