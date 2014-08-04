
var express = require('../')
  , request = require('supertest')
  , assert = require('assert');

describe('res', function(){
  describe('.sendfile(path, fn)', function(){
    it('should invoke the callback when complete', function(done){
      var app = express();

      app.use(function(req, res){
        res.sendfile('test/fixtures/user.html', done)
      });

      request(app)
      .get('/')
      .expect(200)
      .end(function(){});
    })

    it('should utilize the same options as express.static()', function(done){
      var app = express();

      app.use(function(req, res){
        res.sendfile('test/fixtures/user.html', { maxAge: 60000 });
      });

      request(app)
      .get('/')
      .expect('Cache-Control', 'public, max-age=60')
      .end(done);
    })

    it('should invoke the callback on 404', function(done){
      var app = express()
        , calls = 0;

      app.use(function(req, res){
        res.sendfile('test/fixtures/nope.html', function(err){
          ++calls;
          assert(!res.headersSent);
          res.send(err.message);
        });
      });

      request(app)
      .get('/')
      .end(function(err, res){
        assert(1 == calls, 'called too many times');
        res.text.should.startWith("ENOENT, stat");
        res.statusCode.should.equal(200);
        done();
      });
    })

    it('should not override manual content-types', function(done){
      var app = express();

      app.use(function(req, res){
        res.contentType('txt');
        res.sendfile('test/fixtures/user.html');
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/plain')
      .end(done);
    })

    it('should invoke the callback on 403', function(done){
      var app = express()
        , calls = 0;

      app.use(function(req, res){
        res.sendfile('test/fixtures/foo/../user.html', function(err){
          assert(!res.headersSent);
          ++calls;
          res.send(err.message);
        });
      });

      request(app)
      .get('/')
      .expect('Forbidden')
      .expect(200, done);
    })

    it('should invoke the callback on socket error', function(done){
      var app = express()
        , calls = 0;

      app.use(function(req, res){
        res.sendfile('test/fixtures/user.html', function(err){
          assert(!res.headersSent);
          req.socket.listeners('error').should.have.length(1); // node's original handler
          done();
        });

        req.socket.emit('error', new Error('broken!'));
      });

      request(app)
      .get('/')
      .end(function(){});
    })
  })

  describe('.sendfile(path)', function(){
    it('should not serve dotfiles', function(done){
      var app = express();

      app.use(function(req, res){
        res.sendfile('test/fixtures/.name');
      });

      request(app)
      .get('/')
      .expect(404, done);
    })

    it('should accept dotfiles option', function(done){
      var app = express();

      app.use(function(req, res){
        res.sendfile('test/fixtures/.name', { dotfiles: 'allow' });
      });

      request(app)
      .get('/')
      .expect(200, 'tobi', done);
    })

    it('should transfer a file', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.sendfile('test/fixtures/name.txt');
      });

      request(app)
      .get('/')
      .expect(200, 'tobi', done);
    });

    it('should transfer a directory index file', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.sendfile('test/fixtures/blog/');
      });

      request(app)
      .get('/')
      .expect(200, '<b>index</b>', done);
    });

    describe('with an absolute path', function(){
      it('should transfer the file', function(done){
        var app = express();

        app.use(function(req, res){
          res.sendfile(__dirname + '/fixtures/user.html');
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.text.should.equal('<p>{{user.name}}</p>');
          res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
          done();
        });
      })
    })

    describe('with a relative path', function(){
      it('should transfer the file', function(done){
        var app = express();

        app.use(function(req, res){
          res.sendfile('test/fixtures/user.html');
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.text.should.equal('<p>{{user.name}}</p>');
          res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
          done();
        });
      })

      it('should serve relative to "root"', function(done){
        var app = express();

        app.use(function(req, res){
          res.sendfile('user.html', { root: 'test/fixtures/' });
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.text.should.equal('<p>{{user.name}}</p>');
          res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
          done();
        });
      })

      it('should consider ../ malicious when "root" is not set', function(done){
        var app = express();

        app.use(function(req, res){
          res.sendfile('test/fixtures/foo/../user.html');
        });

        request(app)
        .get('/')
        .expect(403, done);
      })

      it('should allow ../ when "root" is set', function(done){
        var app = express();

        app.use(function(req, res){
          res.sendfile('foo/../user.html', { root: 'test/fixtures' });
        });

        request(app)
        .get('/')
        .expect(200, done);
      })

      it('should disallow requesting out of "root"', function(done){
        var app = express();

        app.use(function(req, res){
          res.sendfile('foo/../../user.html', { root: 'test/fixtures' });
        });

        request(app)
        .get('/')
        .expect(403, done);
      })

      it('should next(404) when not found', function(done){
        var app = express()
          , calls = 0;

        app.use(function(req, res){
          res.sendfile('user.html');
        });

        app.use(function(req, res){
          assert(0, 'this should not be called');
        });

        app.use(function(err, req, res, next){
          ++calls;
          next(err);
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.statusCode.should.equal(404);
          calls.should.equal(1);
          done();
        });
      })

      describe('with non-GET', function(){
        it('should still serve', function(done){
          var app = express()
            , calls = 0;

          app.use(function(req, res){
            res.sendfile(__dirname + '/fixtures/name.txt');
          });

          request(app)
          .get('/')
          .expect('tobi', done);
        })
      })
    })
  })
})
