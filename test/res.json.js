'use strict'

var express = require('../')
  , request = require('supertest')
  , assert = require('node:assert');

describe('res', function(){
  describe('.json(object)', function(){
    it('should not support jsonp callbacks', function(done){
      var app = express();

      app.use(function(req, res){
        res.json({ foo: 'bar' });
      });

      request(app)
      .get('/?callback=foo')
      .expect('{"foo":"bar"}', done);
    })

    it('should not override previous Content-Types', function(done){
      var app = express();

      app.get('/', function(req, res){
        res.type('application/vnd.example+json');
        res.json({ hello: 'world' });
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/vnd.example+json; charset=utf-8')
      .expect(200, '{"hello":"world"}', done);
    })

    describe('when given primitives', function(){
      it('should respond with json for null', function(done){
        var app = express();

        app.use(function(req, res){
          res.json(null);
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, 'null', done)
      })

      it('should respond with json for Number', function(done){
        var app = express();

        app.use(function(req, res){
          res.json(300);
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '300', done)
      })

      it('should respond with json for String', function(done){
        var app = express();

        app.use(function(req, res){
          res.json('str');
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '"str"', done)
      })
    })

    describe('when given an array', function(){
      it('should respond with json', function(done){
        var app = express();

        app.use(function(req, res){
          res.json(['foo', 'bar', 'baz']);
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '["foo","bar","baz"]', done)
      })
    })

    describe('when given an object', function(){
      it('should respond with json', function(done){
        var app = express();

        app.use(function(req, res){
          res.json({ name: 'tobi' });
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '{"name":"tobi"}', done)
      })
    })

    describe('"json escape" setting', function () {
      it('should be undefined by default', function () {
        var app = express()
        assert.strictEqual(app.get('json escape'), undefined)
      })

      it('should unicode escape HTML-sniffing characters', function (done) {
        var app = express()

        app.enable('json escape')

        app.use(function (req, res) {
          res.json({ '&': '<script>' })
        })

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '{"\\u0026":"\\u003cscript\\u003e"}', done)
      })

      it('should not break undefined escape', function (done) {
        var app = express()

        app.enable('json escape')

        app.use(function (req, res) {
          res.json(undefined)
        })

        request(app)
          .get('/')
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(200, '', done)
      })
    })

    describe('"json replacer" setting', function(){
      it('should be passed to JSON.stringify()', function(done){
        var app = express();

        app.set('json replacer', function(key, val){
          return key[0] === '_'
            ? undefined
            : val;
        });

        app.use(function(req, res){
          res.json({ name: 'tobi', _id: 12345 });
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '{"name":"tobi"}', done)
      })
    })

    describe('"json spaces" setting', function(){
      it('should be undefined by default', function(){
        var app = express();
        assert(undefined === app.get('json spaces'));
      })

      it('should be passed to JSON.stringify()', function(done){
        var app = express();

        app.set('json spaces', 2);

        app.use(function(req, res){
          res.json({ name: 'tobi', age: 2 });
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '{\n  "name": "tobi",\n  "age": 2\n}', done)
      })
    })

    describe('when value contains a BigInt', function () {
      it('should throw a TypeError with a helpful message', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.json({ id: BigInt(9007199254740991) });
        });

        // Express error handler to capture the thrown error
        app.use(function (err, req, res, next) {
          res.status(500).send(err.message);
        });

        request(app)
          .get('/')
          .expect(500)
          .expect(function (res) {
            assert.ok(
              res.text.indexOf('res.json() cannot serialize BigInt') !== -1,
              'error message should mention res.json() and BigInt'
            );
          })
          .end(done);
      });

      it('should mention the json replacer solution in the error', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.json({ count: BigInt(42) });
        });

        app.use(function (err, req, res, next) {
          res.status(500).send(err.message);
        });

        request(app)
          .get('/')
          .expect(500)
          .expect(function (res) {
            assert.ok(
              res.text.indexOf("json replacer") !== -1,
              'error message should mention json replacer as the solution'
            );
          })
          .end(done);
      });

      it('should work correctly when a json replacer handles BigInt', function (done) {
        var app = express();

        // Developer follows the suggestion from the error message
        app.set('json replacer', function (key, val) {
          return typeof val === 'bigint' ? val.toString() : val;
        });

        app.use(function (req, res) {
          res.json({ id: BigInt(9007199254740991), name: 'Alice' });
        });

        request(app)
          .get('/')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect({ id: '9007199254740991', name: 'Alice' })
          .end(done);
      });

      it('should not affect normal json responses', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.json({ id: 1, name: 'Alice', active: true });
        });

        request(app)
          .get('/')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect({ id: 1, name: 'Alice', active: true })
          .end(done);
      });

      it('should not affect null responses', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.json(null);
        });

        request(app)
          .get('/')
          .expect(200)
          .expect('Content-Type', /json/)
          .end(done);
      });

      it('should re-throw non-BigInt JSON errors unchanged', function (done) {
        var app = express();

        // A custom toJSON that throws a generic error (not BigInt-related)
        app.use(function (req, res) {
          var obj = {
            toJSON: function () { throw new TypeError('some other error'); }
          };
          res.json(obj);
        });

        app.use(function (err, req, res, next) {
          res.status(500).send(err.message);
        });

        request(app)
          .get('/')
          .expect(500)
          .expect(function (res) {
            assert.ok(
              res.text.indexOf('some other error') !== -1,
              'non-BigInt errors should pass through unchanged'
            );
            assert.ok(
              res.text.indexOf('BigInt') === -1,
              'non-BigInt errors should not be wrapped in BigInt message'
            );
          })
          .end(done);
      });
    });
  })
})
