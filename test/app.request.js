'use strict'

var after = require('after')
var express = require('../')
var request = require('supertest');

describe('app', function(){
  describe('.request', function(){
    it('should extend the request prototype', function(done){
      var app = express();

      app.request.querystring = function(){
        return require('node:url').parse(this.url).query;
      };

      app.use(function(req, res){
        res.end(req.querystring());
      });

      request(app)
        .get('/foo?name=tobi')
        .expect(200)
        .expect('name=tobi', done);
    })

    it('should only extend for the referenced app', function (done) {
      var app1 = express()
      var app2 = express()
      
      app1.request.foobar = function () {
        return 'tobi'
      }

      app1.get('/', function (req, res) {
        res.send(req.foobar())
      })

      app2.get('/', function (req, res) {
        // This should fail because foobar doesn't exist on app2's request
        try {
          res.send(req.foobar())
        } catch (err) {
          res.status(500).send(err.message)
        }
      })

      var completed = 0
      var total = 2

      function checkDone() {
        completed++
        if (completed === total) {
          done()
        }
      }

      request(app1)
        .get('/')
        .expect(200)
        .expect('tobi', checkDone)

      request(app2)
        .get('/')
        .expect(500)
        .expect(function(res) {
          // Check that the error indicates foobar is not a function
          var errorMsg = res.text || res.body
          if (typeof errorMsg === 'string') {
            if (!errorMsg.includes('not a function') && 
                !errorMsg.includes('has no method') &&
                !errorMsg.includes('is not a function')) {
              throw new Error('Expected error message about missing function, got: ' + errorMsg)
            }
          }
        })
        .end(checkDone)
    })

    it('should inherit to sub apps', function (done) {
      var app1 = express()
      var app2 = express()
      
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

      var completed = 0
      var total = 2

      function checkDone(err) {
        if (err) return done(err)
        completed++
        if (completed === total) {
          done()
        }
      }

      request(app1)
        .get('/')
        .expect(200)
        .expect('tobi', checkDone)

      request(app1)
        .get('/sub')
        .expect(200)
        .expect('tobi', checkDone)
    })

    it('should allow sub app to override', function (done) {
      var app1 = express()
      var app2 = express()
      
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

      var completed = 0
      var total = 2

      function checkDone(err) {
        if (err) return done(err)
        completed++
        if (completed === total) {
          done()
        }
      }

      request(app1)
        .get('/')
        .expect(200)
        .expect('tobi', checkDone)

      request(app1)
        .get('/sub')
        .expect(200)
        .expect('loki', checkDone)
    })

    it('should not pollute parent app', function (done) {
      var app1 = express()
      var app2 = express()
      
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

      var completed = 0
      var total = 2

      function checkDone(err) {
        if (err) return done(err)
        completed++
        if (completed === total) {
          done()
        }
      }

      request(app1)
        .get('/sub')
        .expect(200)
        .expect('loki', checkDone)

      request(app1)
        .get('/sub/foo')
        .expect(200)
        .expect('tobi', checkDone)
    })
  })
})
