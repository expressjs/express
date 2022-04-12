'use strict'

var express = require('../')
  , request = require('supertest')
  , cookieParser = require('cookie-parser')
var merge = require('utils-merge');

describe('res', function(){
  describe('.cookie(name, object)', function(){
    it('should generate a JSON cookie', function(done){
      var app = express();

      app.use(function(req, res){
        res.cookie('user', { name: 'tobi' }).end();
      });

      request(app)
      .get('/')
      .expect('Set-Cookie', 'user=j%3A%7B%22name%22%3A%22tobi%22%7D; Path=/')
      .expect(200, done)
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
      .expect('Set-Cookie', 'name=tobi; Path=/')
      .expect(200, done)
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
        .expect('Set-Cookie', 'name=tobi; Path=/,age=1; Path=/,gender=%3F; Path=/')
        .expect(200, done)
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
      .expect('Set-Cookie', 'name=tobi; Path=/; HttpOnly; Secure')
      .expect(200, done)
    })

    describe('expires', function () {
      it('should throw on invalid date', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.cookie('name', 'tobi', { expires: new Date(NaN) })
          res.end()
        })

        request(app)
          .get('/')
          .expect(500, /option expires is invalid/, done)
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
          .expect('Set-Cookie', /name=tobi; Max-Age=1; Path=\/; Expires=/)
          .expect(200, done)
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
        var optionsCopy = merge({}, options);

        app.use(function(req, res){
          res.cookie('name', 'tobi', options)
          res.json(options)
        });

        request(app)
        .get('/')
        .expect(200, optionsCopy, done)
      })

      it('should not throw on null', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.cookie('name', 'tobi', { maxAge: null })
          res.end()
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('Set-Cookie', 'name=tobi; Path=/')
          .end(done)
      })

      it('should not throw on undefined', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.cookie('name', 'tobi', { maxAge: undefined })
          res.end()
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('Set-Cookie', 'name=tobi; Path=/')
          .end(done)
      })

      it('should throw an error with invalid maxAge', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.cookie('name', 'tobi', { maxAge: 'foobar' })
          res.end()
        })

        request(app)
          .get('/')
          .expect(500, /option maxAge is invalid/, done)
      })
    })

    describe('priority', function () {
      it('should set low priority', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.cookie('name', 'tobi', { priority: 'low' })
          res.end()
        })

        request(app)
          .get('/')
          .expect('Set-Cookie', /Priority=Low/)
          .expect(200, done)
      })

      it('should set medium priority', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.cookie('name', 'tobi', { priority: 'medium' })
          res.end()
        })

        request(app)
          .get('/')
          .expect('Set-Cookie', /Priority=Medium/)
          .expect(200, done)
      })

      it('should set high priority', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.cookie('name', 'tobi', { priority: 'high' })
          res.end()
        })

        request(app)
          .get('/')
          .expect('Set-Cookie', /Priority=High/)
          .expect(200, done)
      })

      it('should throw with invalid priority', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.cookie('name', 'tobi', { priority: 'foobar' })
          res.end()
        })

        request(app)
          .get('/')
          .expect(500, /option priority is invalid/, done)
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
          .expect('Set-Cookie', 'user=s%3Aj%3A%7B%22name%22%3A%22tobi%22%7D.K20xcwmDS%2BPb1rsD95o5Jm5SqWs1KteqdnynnB7jkTE; Path=/')
          .expect(200, done)
      })
    })

    describe('signed without secret', function(){
      it('should throw an error', function(done){
        var app = express();

        app.use(cookieParser());

        app.use(function(req, res){
          res.cookie('name', 'tobi', { signed: true }).end();
        });

        request(app)
        .get('/')
        .expect(500, /secret\S+ required for signed cookies/, done);
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
        .expect('Set-Cookie', 'name=s%3Atobi.xJjV2iZ6EI7C8E5kzwbfA9PVLl1ZR07UTnuTgQQ4EnQ; Path=/')
        .expect(200, done)
      })
    })
  })
})
