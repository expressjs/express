
var express = require('../')
  , request = require('supertest');

describe('app.verbs()', function(){
  it('should add a router per method', function(done){
    var app = express();

    app.verbs('/tobi', {
      default: function(req, res){
        res.end(req.method);
      }
    });

    request(app)
    .put('/tobi')
    .expect('PUT', function(){
      request(app)
      .get('/tobi')
      .expect('GET', done);
    });
  })

  it('should ', function(done){
    var app = express()
      , n = 0;

    app.verbs('/*', {
      default: function(req, res, next){
        if (n++) return done(new Error('DELETE called several times'));
        next();
      }
    });

    request(app)
    .del('/tobi')
    .expect(404, done);
  })
})
