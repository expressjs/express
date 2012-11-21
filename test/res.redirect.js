
var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.redirect(url)', function(){
    it('should default to a 302 redirect', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .get('/')
      .end(function(err, res){
        res.statusCode.should.equal(302);
        res.headers.should.have.property('location', 'http://google.com');
        done();
      })
    })

    describe('with leading //', function(){
      it('should pass through scheme-relative urls', function(done){
        var app = express();

        app.use(function(req, res){
          res.redirect('//cuteoverload.com');
        });

        request(app)
        .get('/')
        .set('Host', 'example.com')
        .end(function(err, res){
          res.headers.should.have.property('location', '//cuteoverload.com');
          done();
        })
      })
    })

    
    describe('with leading /', function(){
      it('should construct scheme-relative urls', function(done){
        var app = express();

        app.use(function(req, res){
          res.redirect('/login');
        });

        request(app)
        .get('/')
        .set('Host', 'example.com')
        .end(function(err, res){
          res.headers.should.have.property('location', '/login');
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
        .end(function(err, res){
          res.headers.should.have.property('location', '/post/1/./edit');
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
        .end(function(err, res){
          res.headers.should.have.property('location', '/post/1/../new');
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
        .end(function(err, res){
          res.headers.should.have.property('location', '/login');
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
          .end(function(err, res){
            res.headers.should.have.property('location', '/blog/admin/login');
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
          .end(function(err, res){
            res.headers.should.have.property('location', '/blog/admin/login');
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
          .end(function(err, res){
            res.headers.should.have.property('location', '/admin/login');
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
      .end(function(err, res){
        res.statusCode.should.equal(303);
        res.headers.should.have.property('location', 'http://google.com');
        done();
      })
    })
  })

  describe('.redirect(url, status)', function(){
    it('should set the response status', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com', 303);
      });

      request(app)
      .get('/')
      .end(function(err, res){
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
      .end(function(err, res){
        res.headers.should.have.property('location', 'http://google.com');
        res.text.should.equal('');
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
      .end(function(err, res){
        res.headers.should.have.property('location', 'http://google.com');
        res.text.should.equal('<p>Moved Temporarily. Redirecting to <a href="http://google.com">http://google.com</a></p>');
        done();
      })
    })

    it('should escape the url', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('<lame>');
      });

      request(app)
      .get('/')
      .set('Host', 'http://example.com')
      .set('Accept', 'text/html')
      .end(function(err, res){
        res.text.should.equal('<p>Moved Temporarily. Redirecting to <a href="/&lt;lame&gt;">/&lt;lame&gt;</a></p>');
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
      .end(function(err, res){
        res.headers.should.have.property('location', 'http://google.com');
        res.headers.should.have.property('content-length', '51');
        res.text.should.equal('Moved Temporarily. Redirecting to http://google.com');
        done();
      })
    })

    it('should encode the url', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://example.com/?param=<script>alert("hax");</script>');
      });

      request(app)
      .get('/')
      .set('Host', 'http://example.com')
      .set('Accept', 'text/plain, */*')
      .end(function(err, res){
        res.text.should.equal('Moved Temporarily. Redirecting to http://example.com/?param=%3Cscript%3Ealert(%22hax%22);%3C/script%3E');
        done();
      })
    })
  })

  describe('when accepting neither text or html', function(){
    it('should respond with an empty body', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .get('/')
      .set('Accept', 'application/octet-stream')
      .end(function(err, res){
        res.should.have.status(302);
        res.headers.should.have.property('location', 'http://google.com');
        res.headers.should.not.have.property('content-type');
        res.headers.should.have.property('content-length', '0');
        res.text.should.equal('');
        done();
      })
    })
  })
})
