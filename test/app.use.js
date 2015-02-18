
var assert = require('assert');
var express = require('..');
var request = require('supertest');

describe('app', function(){
  it('should emit "mount" when mounted', function(done){
    var blog = express()
      , app = express();

    blog.on('mount', function(arg){
      arg.should.equal(app);
      done();
    });

    app.use(blog);
  })

  describe('.use(app)', function(){
    it('should mount the app', function(done){
      var blog = express()
        , app = express();

      blog.get('/blog', function(req, res){
        res.end('blog');
      });

      app.use(blog);

      request(app)
      .get('/blog')
      .expect('blog', done);
    })

    it('should support mount-points', function(done){
      var blog = express()
        , forum = express()
        , app = express();

      blog.get('/', function(req, res){
        res.end('blog');
      });

      forum.get('/', function(req, res){
        res.end('forum');
      });

      app.use('/blog', blog);
      app.use('/forum', forum);

      request(app)
      .get('/blog')
      .expect('blog', function(){
        request(app)
        .get('/forum')
        .expect('forum', done);
      });
    })

    it('should set the child\'s .parent', function(){
      var blog = express()
        , app = express();

      app.use('/blog', blog);
      blog.parent.should.equal(app);
    })
  })
})
