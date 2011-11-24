
var express = require('../')
  , request = require('./support/http');

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
        , forum = express()
        , app = express();

      blog.get('/blog', function(req, res){
        res.end('blog');
      });
      
      forum.get('/forum', function(req, res){
        res.end('forum');
      });

      app.use(blog);
      app.use(forum);

      request(app)
      .get('/blog')
      .expect('blog', function(){
        request(app)
        .get('/forum')
        .expect('forum', done);
      });
    })
  })

})

