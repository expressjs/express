
const express = require('../')
const request = require('supertest');

describe('app.all()', function(){
  it('should add a router per method', function(done){
    const app = express();

    app.all('/tobi', function(req, res){
      res.end(req.method);
    });

    request(app)
    .put('/tobi')
    .expect('PUT', function(){
      request(app)
      .get('/tobi')
      .expect('GET', done);
    });
  })

  it('should run the callback for a method just once', function(done){
    const app = express()
    var n = 0;

    app.all('/*', function(req, res, next){
      if (n++) return done(new Error('DELETE called several times'));
      next();
    });

    request(app)
    .del('/tobi')
    .expect(404, done);
  })
})
