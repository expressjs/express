
var express = require('../')
  , request = require('supertest');

describe('app.del()', function(){
  it('should alias app.delete()', function(done){
    var app = express();

    app.del('/tobi', function(req, res){
      res.end('deleted tobi!');
    });

    request(app)
    .del('/tobi')
    .expect('deleted tobi!', done);
  })
})
