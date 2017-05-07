
const express = require('../')
const request = require('supertest');

describe('app.del()', function(){
  it('should alias app.delete()', function(done){
    const app = express();

    app.del('/tobi', function(req, res){
      res.end('deleted tobi!');
    });

    request(app)
    .del('/tobi')
    .expect('deleted tobi!', done);
  })
})
