
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
    
    it('should inherit settings', function () {
      var blog = express()
        , app = express();

      app.set('foo', 'bar');
      app.set('views', '/some/custom/path');

      // option 2 - mounted apps need to explicity inherit the views of the parent
      // app. Less magic than option 1 but currently not documented.
      //
      // blog.on('mount', function(parent){
      //   blog.set('views', parent.get('views'));
      // });

      app.use('/blog', blog);

      app.get('foo').should.equal('bar');
      blog.get('foo').should.equal('bar');

      app.get( 'views').should.equal('/some/custom/path');
      blog.get('views').should.equal('/some/custom/path');
      
    });
  })
})
