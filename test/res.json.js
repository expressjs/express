
var express = require('../')
  , request = require('./support/http');

function test(input, output) {
  return function(done){
    var app = express();

    app.use(function(req, res){
      res.json(input);
    });

    request(app)
    .get('/')
    .end(function(res){
      res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
      res.body.should.equal(output);
      done();
    })
  }
}

describe('res', function(){
  describe('.json(object)', function(){
    describe('when given primitives', function(){
      it('should respond with json', test(null, 'null'))
    })
    
    describe('when given an object', function(){
      it('should respond with json', test({ name: 'tobi' }, '{"name":"tobi"}'))
    })
  })
})
