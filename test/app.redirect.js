
var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.redirect(name, url)', function(){
    it('should map a redirect url', function(done){
      var app = express();

      app.redirect('google', 'http://google.com');

      app.use(function(req, res){
        res.redirect('google');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.headers.should.have.property('location', 'http://google.com');
        done();
      })
    })
  })
  
  describe('.redirect(name, fn)', function(){
    it('should map a redirect to a callback', function(done){
      var app = express();

      app.redirect('comments', function(req){
        return '/post/' + req.post.id + '/comments';
      });

      app.use(function(req, res){
        req.post = { id: 1 };
        res.redirect('comments');
      });

      request(app)
      .get('/')
      .set('Host', 'example.com')
      .end(function(res){
        res.headers.should.have.property('location', 'http://example.com/post/1/comments');
        done();
      })
    })
  })
})
