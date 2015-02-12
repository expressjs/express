var express = require('..');
var request = require('supertest');

describe('app', function(){
  describe('.useif(condition, ...)', function(){
    it('should delegate to app.use if condition is true', function (done) {
      var blog = express()
        , app = express();

      blog.get('/blog', function(req, res){
        res.end('blog');
      });

      app.useif(true, function (req, res) {
        res.end('middleware');
      });

      app.use(blog);

      request(app)
      .get('/blog')
      .expect('middleware', done);
    });
    it('should not register the middleware if the condition is false', function (done) {
      var blog = express()
        , app = express();

      blog.get('/blog', function(req, res){
        res.end('blog');
      });

      app.useif(false, function (req, res) {
        res.end('middleware');
      });

      app.use(blog);

      request(app)
      .get('/blog')
      .expect('blog', done);
    });
  })
})
