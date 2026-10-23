'use strict'

var assert = require('node:assert')
var after = require('after')
var express = require('../')
  , request = require('supertest');

describe('app', function(){
  describe('.response', function(){
    it('should extend the response prototype', function(done){
      var app = express();

      app.response.shout = function(str){
        this.send(str.toUpperCase());
      };

      app.use(function(req, res){
        res.shout('hey');
      });

      request(app)
      .get('/')
      .expect('HEY', done);
    })

    it('should only extend for the referenced app', function (done) {
      var app1 = express()
      var app2 = express()
      var cb = after(2, done)

      app1.response.shout = function (str) {
        this.send(str.toUpperCase())
      }

      app1.get('/', function (req, res) {
        res.shout('foo')
      })

      app2.get('/', function (req, res) {
        res.shout('foo')
      })

      request(app1)
        .get('/')
        .expect(200, 'FOO', cb)

      request(app2)
        .get('/')
        .expect(500, /(?:not a function|has no method)/, cb)
    })

    it('should inherit to sub apps', function (done) {
      var app1 = express()
      var app2 = express()
      var cb = after(2, done)

      app1.response.shout = function (str) {
        this.send(str.toUpperCase())
      }

      app1.use('/sub', app2)

      app1.get('/', function (req, res) {
        res.shout('foo')
      })

      app2.get('/', function (req, res) {
        res.shout('foo')
      })

      request(app1)
        .get('/')
        .expect(200, 'FOO', cb)

      request(app1)
        .get('/sub')
        .expect(200, 'FOO', cb)
    })

    it('should allow sub app to override', function (done) {
      var app1 = express()
      var app2 = express()
      var cb = after(2, done)

      app1.response.shout = function (str) {
        this.send(str.toUpperCase())
      }

      app2.response.shout = function (str) {
        this.send(str + '!')
      }

      app1.use('/sub', app2)

      app1.get('/', function (req, res) {
        res.shout('foo')
      })

      app2.get('/', function (req, res) {
        res.shout('foo')
      })

      request(app1)
        .get('/')
        .expect(200, 'FOO', cb)

      request(app1)
        .get('/sub')
        .expect(200, 'foo!', cb)
    })

    it('should not pollute parent app', function (done) {
      var app1 = express()
      var app2 = express()
      var cb = after(2, done)

      app1.response.shout = function (str) {
        this.send(str.toUpperCase())
      }

      app2.response.shout = function (str) {
        this.send(str + '!')
      }

      app1.use('/sub', app2)

      app1.get('/sub/foo', function (req, res) {
        res.shout('foo')
      })

      app2.get('/', function (req, res) {
        res.shout('foo')
      })

      request(app1)
        .get('/sub')
        .expect(200, 'foo!', cb)

      request(app1)
        .get('/sub/foo')
        .expect(200, 'FOO', cb)
    })

    it('should deprecate when redirect called with an empty url', function (done) {
      var app = express()
      var deprecations = []

      app.use(function (req, res) {
        captureDeprecations(deprecations, function () {
          res.redirect('')
        })
      })

      request(app)
        .get('/')
        .expect(302)
        .expect('Location', '')
        .expect(function () {
          assert.deepStrictEqual(deprecations, ['Provide a url argument'])
        })
        .expect(/Redirecting to/, done)
    })

    it('should deprecate when redirect address is not a string', function (done) {
      var app = express()
      var deprecations = []

      app.use(function (req, res) {
        captureDeprecations(deprecations, function () {
          res.redirect(302, 123)
        })
      })

      request(app)
        .get('/')
        .expect(302)
        .expect('Location', '123')
        .expect(function () {
          assert.deepStrictEqual(deprecations, ['Url must be a string'])
        })
        .expect(/Redirecting to 123/, done)
    })

    it('should deprecate and raise when redirect status is not a number', function (done) {
      var app = express()
      var deprecations = []

      app.use(function (req, res) {
        captureDeprecations(deprecations, function () {
          res.redirect('foo', '/bar')
        })
      })

      request(app)
        .get('/')
        .expect(function () {
          assert.deepStrictEqual(deprecations, ['Status must be a number'])
        })
        .expect(500, /Invalid status code/, done)
    })
  })
})

function captureDeprecations (deprecations, fn) {
  function onDeprecation (warning) {
    if (warning.namespace === 'express') {
      deprecations.push(warning.message)
    }
  }

  process.on('deprecation', onDeprecation)
  try {
    fn()
  } finally {
    process.removeListener('deprecation', onDeprecation)
  }
}
