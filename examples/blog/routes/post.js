
/**
 * Module dependencies.
 */

var basicAuth = require('../../../lib/express').basicAuth
  , Post = require('../models/post');

module.exports = function(app){
  /**
   * Apply basic auth to all post related routes
   */

  app.all('/post(/*)?', basicAuth(function(user, pass){
    return 'admin' == user && 'express' == pass;
  }));

  /**
   * Map :post to the database, loading
   * every time :post is present.
   */

  app.param('post', function(req, res, next, id){
    Post.get(id, function(err, post){
      if (err) return next(err);
      if (!post) return next(new Error('failed to load post ' + id));
      req.post = post;
      next();
    });
  });

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
    var data = req.body.post || {}
      , post = new Post(data.title, data.body);
    
    post.validate(function(err){
      if (err) {
        req.session.error = err.message;
        return res.redirect('back');
      }

      post.save(function(err){
        req.session.message = 'Successfully created the post.';
        res.redirect('/post/' + post.id);
      });  
    });
  });

  /**
   * Display the post.
   */

  app.get('/post/:post', function(req, res){
    res.render('post', { post: req.post });
  });

  /**
   * Display the post edit form.
   */

  app.get('/post/:post/edit', function(req, res){
    res.render('post/form', { post: req.post });
  });

  /**
   * Update post. Typically a data layer would handle this stuff.
   */

  app.put('/post/:post', function(req, res, next){
    var post = req.post;
    post.validate(function(err){
      if (err) {
        req.session.error = err.message;
        return res.redirect('back');
      }

      post.update(req.body.post, function(err){
        if (err) return next(err);
        req.session.message = 'Successfully updated post';
        res.redirect('back');
      });
    });
  });
};