
var express = require('../')
  , request = require('./support/http')
  , assert = require('assert');

describe('res', function(){
  describe('.sendfile(path, fn)', function(){
    it('should invoke the callback when complete', function(done){
      var app = express()
        , calls = 0;

      app.use(function(req, res){
        res.sendfile('test/fixtures/user.html', function(err){
          assert(!err);
          ++calls;
        });
      });

      request(app)
      .get('/')
      .end(function(res){
        calls.should.equal(1);
        res.statusCode.should.equal(200);
        done();
      });
    })
    
    it('should invoke the callback on 404', function(done){
      var app = express()
        , calls = 0;

      app.use(function(req, res){
        res.sendfile('test/fixtures/nope.html', function(err){
          assert(!res.headerSent);
          ++calls;
          res.send(err.message);
        });
      });

      request(app)
      .get('/')
      .end(function(res){
        calls.should.equal(1);
        res.body.should.equal('Not Found');
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
      .end(function(res){
        res.should.have.header('content-type', 'text/plain');
        done();
      });
    })

    it('should invoke the callback on 403', function(done){
      var app = express()
        , calls = 0;

      app.use(function(req, res){
        res.sendfile('test/fixtures/foo/../user.html', function(err){
          assert(!res.headerSent);
          ++calls;
          res.send(err.message);
        });
      });

      request(app)
      .get('/')
      .end(function(res){
        res.body.should.equal('Forbidden');
        res.statusCode.should.equal(200);
        calls.should.equal(1);
        done();
      });
    })
  })

  describe('.sendfile(path)', function(){
    describe('with an absolute path', function(){
      it('should transfer the file', function(done){
        var app = express();

        app.use(function(req, res){
          res.sendfile(__dirname + '/fixtures/user.html');
        });

        request(app)
        .get('/')
        .end(function(res){
          res.body.should.equal('<p>{{user.name}}</p>');
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
        .end(function(res){
          res.body.should.equal('<p>{{user.name}}</p>');
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
        .end(function(res){
          res.body.should.equal('<p>{{user.name}}</p>');
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
        .end(function(res){
          res.statusCode.should.equal(403);
          done();
        });
      })
      
      it('should allow ../ when "root" is set', function(done){
        var app = express();

        app.use(function(req, res){
          res.sendfile('foo/../user.html', { root: 'test/fixtures' });
        });

        request(app)
        .get('/')
        .end(function(res){
          res.statusCode.should.equal(200);
          done();
        });
      })
      
      it('should disallow requesting out of "root"', function(done){
        var app = express();

        app.use(function(req, res){
          res.sendfile('foo/../../user.html', { root: 'test/fixtures' });
        });

        request(app)
        .get('/')
        .end(function(res){
          res.statusCode.should.equal(403);
          done();
        });
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
        .end(function(res){
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
