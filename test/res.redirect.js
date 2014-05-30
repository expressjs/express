
var express = require('../')
  , request = require('supertest');

describe('res', function(){
  describe('.redirect(url)', function(){
    it('should default to a 302 redirect', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .get('/')
      .expect('location', 'http://google.com')
      .expect(302, done)
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
      .expect('location', 'http://google.com')
      .expect('content-length', '0')
      .expect(302, '', function(err, res){
        if (err) return done(err)
        res.headers.should.not.have.property('content-type');
        done();
      })
    })
  })

  describe('responses redirected to relative paths', function(){
    function create(depth, parent) {
      var app = express();

      if (parent) {
        parent.use('/depth' + depth, app);
      }

      app.get('/', function(req, res){
        res.redirect('./index');
      });

      app.get('/index', function(req, res){
        res.json({ depth: depth, content: 'index' });
      });

      return app;
    }

    var root = create(0);
    var depth1 = create(1, root);
    var depth2 = create(2, depth1);
    var depth3 = create(3, depth2);

    root.use('/depth2', depth2);
    root.use('/depth3', depth3);

    it('should not contain redundant leading slashes in the location header', function(done){
      request(root)
      .get('/')
      .end(function(err, res){
        res.headers.location.search(/^\/{2}/).should.equal(-1);
        done();
      })
    })

    it('should preserve context when redirecting nested applications at any depth', function(done){
      request(root)
      .get('/depth1')
      .end(function(err, res){
        res.headers.should.have.property('location', '/depth1/index');

        request(root)
        .get('/depth1/depth2')
        .end(function(err, res){
          res.headers.should.have.property('location', '/depth1/depth2/index');

          request(root)
          .get('/depth1/depth2/depth3')
          .end(function(err, res){
            res.headers.should.have.property('location', '/depth1/depth2/depth3/index');
            done();
          })
        })
      });
    })

    it('should redirect correctly for nested applications that have been remounted', function(done){
      request(root)
      .get('/depth2')
      .end(function(err, res){
        res.headers.should.have.property('location', '/depth2/index');
        request(root)
        .get('/depth3')
        .end(function(err, res){
          res.headers.should.have.property('location', '/depth3/index');
          done();
        })
      })
    })
  })
})
