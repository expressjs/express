
var express = require('../')
  , request = require('supertest')
  , mixin = require('utils-merge')
  , cookie = require('cookie')
  , cookieParser = require('cookie-parser')

describe('res', function(){
  describe('.cookie(name, object)', function(){
    it('should generate a JSON cookie', function(done){
      var app = express();

      app.use(function(req, res){
        res.cookie('user', { name: 'tobi' }).end();
      });

      request(app)
      .get('/')
      .end(function(err, res){
        var val = ['user=' + encodeURIComponent('j:{"name":"tobi"}') + '; Path=/'];
        res.headers['set-cookie'].should.eql(val);
        done();
      })
    })
  })

  describe('.cookie(name, string)', function(){
    it('should set a cookie', function(done){
      var app = express();

      app.use(function(req, res){
        res.cookie('name', 'tobi').end();
      });

      request(app)
      .get('/')
      .end(function(err, res){
        var val = ['name=tobi; Path=/'];
        res.headers['set-cookie'].should.eql(val);
        done();
      })
    })

    it('should allow multiple calls', function(done){
      var app = express();

      app.use(function(req, res){
        res.cookie('name', 'tobi');
        res.cookie('age', 1);
        res.cookie('gender', '?');
        res.end();
      });

      request(app)
      .get('/')
      .end(function(err, res){
        var val = ['name=tobi; Path=/', 'age=1; Path=/', 'gender=%3F; Path=/'];
        res.headers['set-cookie'].should.eql(val);
        done();
      })
    })
  })

  describe('.cookie(name, string, options)', function(){
    it('should set params', function(done){
      var app = express();

      app.use(function(req, res){
        res.cookie('name', 'tobi', { httpOnly: true, secure: true });
        res.end();
      });

      request(app)
      .get('/')
      .end(function(err, res){
        var val = ['name=tobi; Path=/; HttpOnly; Secure'];
        res.headers['set-cookie'].should.eql(val);
        done();
      })
    })

    describe('maxAge', function(){
      it('should set relative expires', function(done){
        var app = express();

        app.use(function(req, res){
          res.cookie('name', 'tobi', { maxAge: 1000 });
          res.end();
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.headers['set-cookie'][0].should.not.containEql('Thu, 01 Jan 1970 00:00:01 GMT');
          done();
        })
      })

      it('should set max-age', function(done){
        var app = express();

        app.use(function(req, res){
          res.cookie('name', 'tobi', { maxAge: 1000 });
          res.end();
        });

        request(app)
        .get('/')
        .expect('Set-Cookie', /Max-Age=1/, done)
      })

      it('should not mutate the options object', function(done){
        var app = express();

        var options = { maxAge: 1000 };
        var optionsCopy = mixin({}, options);

        app.use(function(req, res){
          res.cookie('name', 'tobi', options)
          res.end();
        });

        request(app)
        .get('/')
        .end(function(err, res){
          options.should.eql(optionsCopy);
          done();
        })
      })
    })

    describe('signed', function(){
      it('should generate a signed JSON cookie', function(done){
        var app = express();

        app.use(cookieParser('foo bar baz'));

        app.use(function(req, res){
          res.cookie('user', { name: 'tobi' }, { signed: true }).end();
        });

        request(app)
        .get('/')
        .end(function(err, res){
          var val = res.headers['set-cookie'][0];
          val = cookie.parse(val.split('.')[0]);
          val.user.should.equal('s:j:{"name":"tobi"}');
          done();
        })
      })
    })

    describe('.signedCookie(name, string)', function(){
      it('should set a signed cookie', function(done){
        var app = express();

        app.use(cookieParser('foo bar baz'));

        app.use(function(req, res){
          res.cookie('name', 'tobi', { signed: true }).end();
        });

        request(app)
        .get('/')
        .end(function(err, res){
          var val = ['name=s%3Atobi.xJjV2iZ6EI7C8E5kzwbfA9PVLl1ZR07UTnuTgQQ4EnQ; Path=/'];
          res.headers['set-cookie'].should.eql(val);
          done();
        })
      })
    })
  })
})
