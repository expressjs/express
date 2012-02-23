
var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.redirect(url)', function(){
    it('should respect X-Forwarded-Proto when "trust proxy" is enabled', function(done){
      var app = express();

      app.enable('trust proxy');

      app.use(function(req, res){
        res.redirect('/login');
      });

      request(app)
      .get('/')
      .set('Host', 'example.com')
      .set('X-Forwarded-Proto', 'https')
      .end(function(res){
        res.statusCode.should.equal(302);
        res.headers.should.have.property('location', 'https://example.com/login');
        done();
      })
    })

    it('should default to a 302 redirect', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.statusCode.should.equal(302);
        res.headers.should.have.property('location', 'http://google.com');
        done();
      })
    })
    
    describe('with leading /', function(){
      it('should construct host-relative urls', function(done){
        var app = express();

        app.use(function(req, res){
          res.redirect('/login');
        });

        request(app)
        .get('/')
        .set('Host', 'example.com')
        .end(function(res){
          res.headers.should.have.property('location', 'http://example.com/login');
          done();
        })
      })
    })

    describe('with leading ./', function(){
      it('should construct path-relative urls', function(done){
        var app = express();

        app.use(function(req, res){
          res.redirect('./edit');
        });

        request(app)
        .get('/post/1')
        .set('Host', 'example.com')
        .end(function(res){
          res.headers.should.have.property('location', 'http://example.com/post/1/./edit');
          done();
        })
      })
    })

    describe('with leading ../', function(){
      it('should construct path-relative urls', function(done){
        var app = express();

        app.use(function(req, res){
          res.redirect('../new');
        });

        request(app)
        .get('/post/1')
        .set('Host', 'example.com')
        .end(function(res){
          res.headers.should.have.property('location', 'http://example.com/post/1/../new');
          done();
        })
      })
    })
    
    describe('without leading /', function(){
      it('should construct mount-point relative urls', function(done){
        var app = express();

        app.use(function(req, res){
          res.redirect('login');
        });

        request(app)
        .get('/')
        .set('Host', 'example.com')
        .end(function(res){
          res.headers.should.have.property('location', 'http://example.com/login');
          done();
        })
      })
    })
    
    describe('when mounted', function(){
      describe('deeply', function(){
        it('should respect the mount-point', function(done){
          var app = express()
            , blog = express()
            , admin = express();

          admin.use(function(req, res){
            res.redirect('login');
          });

          app.use('/blog', blog);
          blog.use('/admin', admin);

          request(app)
          .get('/blog/admin')
          .set('Host', 'example.com')
          .end(function(res){
            res.headers.should.have.property('location', 'http://example.com/blog/admin/login');
            done();
          })
        })
      })

      describe('omitting leading /', function(){
        it('should respect the mount-point', function(done){
          var app = express()
            , admin = express();

          admin.use(function(req, res){
            res.redirect('admin/login');
          });

          app.use('/blog', admin);

          request(app)
          .get('/blog')
          .set('Host', 'example.com')
          .end(function(res){
            res.headers.should.have.property('location', 'http://example.com/blog/admin/login');
            done();
          })
        })
      })

      describe('providing leading /', function(){
        it('should ignore mount-point', function(done){
          var app = express()
            , admin = express();

          admin.use(function(req, res){
            res.redirect('/admin/login');
          });

          app.use('/blog', admin);

          request(app)
          .get('/blog')
          .set('Host', 'example.com')
          .end(function(res){
            res.headers.should.have.property('location', 'http://example.com/admin/login');
            done();
          })
        })
      })
    })
  })

  describe('.redirect(status, url)', function(){
    it('should set the response status', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect(303, 'http://google.com');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.statusCode.should.equal(303);
        res.headers.should.have.property('location', 'http://google.com');
        done();
      })
    })
  })
  
  describe('when the request method is HEAD', function(){
    it('should ignore the body', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .head('/')
      .end(function(res){
        res.headers.should.have.property('location', 'http://google.com');
        res.body.should.equal('');
        done();
      })
    })
  })
  
  describe('when accepting html', function(){
    it('should respond with html', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/html')
      .end(function(res){
        res.headers.should.have.property('location', 'http://google.com');
        res.body.should.equal('<p>Moved Temporarily. Redirecting to <a href="http://google.com">http://google.com</a></p>');
        done();
      })
    })
  })
  
  describe('when accepting text', function(){
    it('should respond with text', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/plain, */*')
      .end(function(res){
        res.headers.should.have.property('location', 'http://google.com');
        res.body.should.equal('Moved Temporarily. Redirecting to http://google.com');
        done();
      })
    })
  })
})
