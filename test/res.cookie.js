'use strict'

var express = require('../')
  , request = require('supertest')
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

  describe('.cookie(name, string, options, encrypt)', function () {
    it('should return a stringified json with the encrypted cookie', function (done) {
      var app = express();
      var { Buffer } = require('node:buffer');

      app.use(cookieParser('my-secret'));

      app.use(function (req, res) {
        res.cookie('name', 'tobi', undefined, {
          key: Buffer.from([
            0x66, 0xcc, 0xc0, 0xa1, 0x9f, 0x64, 0x26, 0x70, 0x84, 0xfe, 0xc7,
            0x0b, 0x2a, 0xf5, 0xf9, 0x45, 0x8e, 0xbc, 0x80, 0x4b, 0x60, 0x64,
            0xff, 0xc7, 0x77, 0x4f, 0xde, 0x97, 0xc1, 0xdf, 0x09, 0x5b,
          ]),
          iv: Buffer.from([
            0xdf, 0x16, 0x7e, 0xd1, 0xc9, 0x2c, 0x24, 0x1b, 0x02, 0x4f, 0x48,
            0x24, 0x62, 0xc6, 0x3b, 0x9b,
          ]),
        });
        res.end();
      });

      request(app)
        .get('/')
        .expect(
          'Set-Cookie',
          'name=%7B%22encryptedText%22%3A%22wdYTOw%3D%3D%22%2C%22iv%22%3A%223xZ%2B0cksJBsCT0gkYsY7mw%3D%3D%22%2C%22authTag%22%3A%22pbC2HFCHVKkeAVA46GoNtg%3D%3D%22%7D; Path=/',
        )
        .expect(200, done);
    });

    it('should return a stringified json with the encrypted signed cookie', function (done) {
      var app = express();
      var { Buffer } = require('node:buffer');

      app.use(cookieParser('my-secret'));

      app.use(function (req, res) {
        res.cookie(
          'name',
          'tobi',
          { signed: true },
          {
            key: Buffer.from([
              0x66, 0xcc, 0xc0, 0xa1, 0x9f, 0x64, 0x26, 0x70, 0x84, 0xfe, 0xc7,
              0x0b, 0x2a, 0xf5, 0xf9, 0x45, 0x8e, 0xbc, 0x80, 0x4b, 0x60, 0x64,
              0xff, 0xc7, 0x77, 0x4f, 0xde, 0x97, 0xc1, 0xdf, 0x09, 0x5b,
            ]),
            iv: Buffer.from([
              0xdf, 0x16, 0x7e, 0xd1, 0xc9, 0x2c, 0x24, 0x1b, 0x02, 0x4f, 0x48,
              0x24, 0x62, 0xc6, 0x3b, 0x9b,
            ]),
          },
        );
        res.end();
      });

      request(app)
        .get('/')
        .expect(
          'Set-Cookie',
          'name=s%3A%7B%22encryptedText%22%3A%22wdYTOw%3D%3D%22%2C%22iv%22%3A%223xZ%2B0cksJBsCT0gkYsY7mw%3D%3D%22%2C%22authTag%22%3A%22pbC2HFCHVKkeAVA46GoNtg%3D%3D%22%7D.%2FbjKv%2BoqY%2BsjNKQp%2FyAgxhemLopKyKnQt1ngpRxhfL0; Path=/',
        )
        .expect(200, done);
    });
  });

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

    describe('partitioned', function () {
      it('should set partitioned', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.cookie('name', 'tobi', { partitioned: true });
          res.end();
        });

        request(app)
          .get('/')
          .expect('Set-Cookie', 'name=tobi; Path=/; Partitioned')
          .expect(200, done)
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
        var optionsCopy = { ...options };

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
