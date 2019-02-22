var express = require('../')
  , request = require('supertest');

describe('res', function(){
  describe('.jsonError(Object)', function(){
    it('should sendError as application/json', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonError({ name: 'tobi' });
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(500, '{"name":"tobi"}', done)
    })
  })

  describe('.jsonError(Error)', function(){
    it('should allow to jsonError a custom Error instance', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonError(new ApiError(403, 'foo'));
      });

      request(app)
      .get('/')
      .expect(403, '{"text":"foo"}', done)
    })
  })
})

function ApiError(status, message) {
  this.status = status
  this.message = message
  Error.call(this, message)
}
ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.toJSON = function() { return { text: this.message } }
