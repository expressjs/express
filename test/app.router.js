
var express = require('../')
  , request = require('./support/http');

describe('app.router', function(){
  it('should be .use()able', function(done){
    var app = express();

    var calls = [];

    app.use(function(req, res, next){
      calls.push('before');
      next();
    });
    
    app.use(app.router);

    app.use(function(req, res, next){
      calls.push('after');
      res.end();
    });

    app.get('/', function(req, res, next){
      calls.push('GET /')
      next();
    });

    request(app)
    .get('/')
    .end(function(res){
      calls.should.eql(['before', 'GET /', 'after'])
      done();
    })
  })
  
  it('should be auto .use()d on the first app.VERB() call', function(done){
    var app = express();

    var calls = [];

    app.use(function(req, res, next){
      calls.push('before');
      next();
    });
    
    app.get('/', function(req, res, next){
      calls.push('GET /')
      next();
    });

    app.use(function(req, res, next){
      calls.push('after');
      res.end();
    });

    request(app)
    .get('/')
    .end(function(res){
      calls.should.eql(['before', 'GET /', 'after'])
      done();
    })
  })

  describe('case sensitivity', function(){
    it('should be disabled by default', function(done){
      var app = express();

      app.get('/user', function(req, res){
        res.end('tj');
      });

      request(app)
      .get('/USER')
      .expect('tj', done);
    })
    
    describe('when "case sensitive routing" is enabled', function(){
      it('should match identical casing', function(done){
        var app = express();

        app.enable('case sensitive routing');

        app.get('/uSer', function(req, res){
          res.end('tj');
        });

        request(app)
        .get('/uSer')
        .expect('tj', done);
      })
      
      it('should not match otherwise', function(done){
        var app = express();

        app.enable('case sensitive routing');

        app.get('/uSer', function(req, res){
          res.end('tj');
        });

        request(app)
        .get('/user')
        .expect('Cannot GET /user', done);
      })
    })
  })

  describe('trailing slashes', function(){
    it('should be optional by default', function(done){
      var app = express();

      app.get('/user', function(req, res){
        res.end('tj');
      });

      request(app)
      .get('/user/')
      .expect('tj', done);
    })
    
    describe('when "strict routing" is enabled', function(){
      it('should match trailing slashes', function(done){
        var app = express();

        app.enable('strict routing');

        app.get('/user/', function(req, res){
          res.end('tj');
        });

        request(app)
        .get('/user/')
        .expect('tj', done);
      })
      
      it('should match no slashes', function(done){
        var app = express();

        app.enable('strict routing');

        app.get('/user', function(req, res){
          res.end('tj');
        });

        request(app)
        .get('/user')
        .expect('tj', done);
      })
      
      it('should fail when omitting the trailing slash', function(done){
        var app = express();

        app.enable('strict routing');

        app.get('/user/', function(req, res){
          res.end('tj');
        });

        request(app)
        .get('/user')
        .expect('Cannot GET /user', done);
      })
      
      it('should fail when adding the trailing slash', function(done){
        var app = express();

        app.enable('strict routing');

        app.get('/user', function(req, res){
          res.end('tj');
        });

        request(app)
        .get('/user/')
        .expect('Cannot GET /user/', done);
      })
    })
  })

  describe(':name', function(){
    it('should denote a capture group', function(done){
      var app = express();

      app.get('/user/:user', function(req, res){
        res.end(req.params.user);
      });

      request(app)
      .get('/user/tj')
      .expect('tj', done);
    })
    
    it('should allow several capture groups', function(done){
      var app = express();

      app.get('/user/:user/:op', function(req, res){
        res.end(req.params.op + 'ing ' + req.params.user);
      });

      request(app)
      .get('/user/tj/edit')
      .expect('editing tj', done);
    })
  })

  describe(':name?', function(){
    it('should denote an optional capture group', function(done){
      var app = express();

      app.get('/user/:user/:op?', function(req, res){
        var op = req.params.op || 'view';
        res.end(op + 'ing ' + req.params.user);
      });

      request(app)
      .get('/user/tj')
      .expect('viewing tj', done);
    })
    
    it('should populate the capture group', function(done){
      var app = express();

      app.get('/user/:user/:op?', function(req, res){
        var op = req.params.op || 'view';
        res.end(op + 'ing ' + req.params.user);
      });

      request(app)
      .get('/user/tj/edit')
      .expect('editing tj', done);
    })
  })
})
