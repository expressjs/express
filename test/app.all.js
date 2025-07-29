'use strict'

var after = require('after')
var express = require('../')
  , request = require('supertest');

describe('app.all()', function(){
  it('should add a router per method', function(done){
    var app = express();
    var cb = after(2, done)

    app.all('/tobi', function(req, res){
      res.end(req.method);
    });

    request(app)
      .put('/tobi')
      .expect(200, 'PUT', cb)

    request(app)
      .get('/tobi')
      .expect(200, 'GET', cb)
  })

  it('should run the callback for a method just once', function(done){
    var app = express()
      , n = 0;

    app.all('/*splat', function(req, res, next){
      if (n++) return done(new Error('DELETE called several times'));
      next();
    });

    request(app)
    .del('/tobi')
    .expect(404, done);
  })

  describe('wildcard error handling', function(){
    it('should provide helpful error for bare wildcard "*"', function(){
      var app = express();

      try {
        app.all('*', function(req, res){
          res.end('wildcard');
        });
        throw new Error('Expected error was not thrown');
      } catch (err) {
        if (err.code !== 'INVALID_WILDCARD_ROUTE') {
          throw err;
        }
        // Verify the error message mentions Express v5 and provides solution
        if (!err.message.includes('Express v5')) {
          throw new Error('Error message should mention Express v5');
        }
        if (!err.message.includes('/*splat')) {
          throw new Error('Error message should suggest /*splat alternative');
        }
      }
    })

    it('should provide helpful error for "/*" wildcard', function(){
      var app = express();

      try {
        app.all('/*', function(req, res){
          res.end('wildcard');
        });
        throw new Error('Expected error was not thrown');
      } catch (err) {
        if (err.code !== 'INVALID_WILDCARD_ROUTE') {
          throw err;
        }
        // Verify the error message is helpful
        if (!err.message.includes('wildcard routes must have named parameters')) {
          throw new Error('Error message should explain named parameter requirement');
        }
      }
    })

    it('should still work with named wildcard "/*splat"', function(done){
      var app = express();

      app.all('/*splat', function(req, res){
        res.end('splat: ' + req.params.splat);
      });

      request(app)
        .get('/anything/here')
        .expect(200, 'splat: anything,here', done);
    })
  })
})
