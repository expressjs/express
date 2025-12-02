'use strict'

var express = require('..')
var request = require('supertest')

describe('res', function () {
  describe('.sendStatus(statusCode)', function () {
    it('should send the status code and message as body', function (done) {
      var app = express();

      app.use(function(req, res){
        res.sendStatus(201);
      });

      request(app)
      .get('/')
      .expect(201, 'Created', done);
    })

    it('should work with unknown code', function (done) {
      var app = express();

      app.use(function(req, res){
        res.sendStatus(599);
      });

      request(app)
      .get('/')
      .expect(599, '599', done);
    })

    describe('with invalid status codes', function(){
      it('should fallback to 500 for undefined status code', function(done){
        var app = express()

        app.use(function(req, res){
          res.sendStatus(undefined)
        })

        request(app)
          .get('/')
          .expect(500, 'Internal Server Error', done)
      })

      it('should fallback to 500 for BigInt status code', function(done){
        var app = express()

        app.use(function(req, res){
          res.sendStatus(200n)
        })

        request(app)
          .get('/')
          .expect(500, 'Internal Server Error', done)
      })

      it('should fallback to 500 for string status code', function(done){
        var app = express()

        app.use(function(req, res){
          res.sendStatus('invalid')
        })

        request(app)
          .get('/')
          .expect(500, 'Internal Server Error', done)
      })

      it('should contain deprecation logic for invalid status codes', function(){
        // Test that the deprecation logic is present by examining the function
        var express = require('..')
        var app = express()
        var res = app.response

        // Verify the function contains deprecation logic
        var sendStatusSource = res.sendStatus.toString()
        // Check that the function contains the deprecation warning
        if (sendStatusSource.indexOf('deprecate') === -1) {
          throw new Error('sendStatus function should contain deprecation warning')
        }
        if (sendStatusSource.indexOf('typeof statusCode !== \'number\'') === -1) {
          throw new Error('sendStatus function should check for non-number status codes')
        }
        if (sendStatusSource.indexOf('statusCode = 500') === -1) {
          throw new Error('sendStatus function should fallback to status 500')
        }

        // Check deprecation message content
        if (sendStatusSource.indexOf('Express 6') === -1) {
          throw new Error('Deprecation message should mention Express 6')
        }
      })
    })

    it('should not affect valid number status codes', function(done){
      var app = express()

      app.use(function(req, res){
        res.sendStatus(200)
      })

      request(app)
        .get('/')
        .expect(200, 'OK', done)
    })
  })
})
