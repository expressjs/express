'use strict'

var after = require('after')
var express = require('../')
  , request = require('supertest');

describe('app', function(){
  describe('.request', function(){
    it('should extend the request prototype', function(done){
      var app = express();

      app.request.querystring = function(){
        return require('url').parse(this.url).query;
      };

      app.use(function(req, res){
        res.end(req.querystring());
      });

      request(app)
      .get('/foo?name=tobi')
      .expect('name=tobi', done);
    })

    it('should only extend for the referenced app', function (done) {
      var app1 = express()
      var app2 = express()
      var cb = after(2, done)

      app1.request.foobar = function () {
        return 'tobi'
      }

      app1.get('/', function (req, res) {
        res.send(req.foobar())
      })

      app2.get('/', function (req, res) {
        res.send(req.foobar())
      })

      request(app1)
        .get('/')
        .expect(200, 'tobi', cb)

      request(app2)
        .get('/')
        .expect(500, /(?:not a function|has no method)/, cb)
    })

    it('should inherit to sub apps', function (done) {
      var app1 = express()
      var app2 = express()
      var cb = after(2, done)

      app1.request.foobar = function () {
        return 'tobi'
      }

      app1.use('/sub', app2)

      app1.get('/', function (req, res) {
        res.send(req.foobar())
      })

      app2.get('/', function (req, res) {
        res.send(req.foobar())
      })

      request(app1)
        .get('/')
        .expect(200, 'tobi', cb)

      request(app1)
        .get('/sub')
        .expect(200, 'tobi', cb)
    })

    it('should allow sub app to override', function (done) {
      var app1 = express()
      var app2 = express()
      var cb = after(2, done)

      app1.request.foobar = function () {
        return 'tobi'
      }

      app2.request.foobar = function () {
        return 'loki'
      }

      app1.use('/sub', app2)

      app1.get('/', function (req, res) {
        res.send(req.foobar())
      })

      app2.get('/', function (req, res) {
        res.send(req.foobar())
      })

      request(app1)
        .get('/')
        .expect(200, 'tobi', cb)

      request(app1)
        .get('/sub')
        .expect(200, 'loki', cb)
    })

    it('should not pollute parent app', function (done) {
      var app1 = express()
      var app2 = express()
      var cb = after(2, done)

      app1.request.foobar = function () {
        return 'tobi'
      }

      app2.request.foobar = function () {
        return 'loki'
      }

      app1.use('/sub', app2)

      app1.get('/sub/foo', function (req, res) {
        res.send(req.foobar())
      })

      app2.get('/', function (req, res) {
        res.send(req.foobar())
      })

      request(app1)
        .get('/sub')
        .expect(200, 'loki', cb)

      request(app1)
        .get('/sub/foo')
        .expect(200, 'tobi', cb)
    })
  })
})
