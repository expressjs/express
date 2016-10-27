
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.rawQuery', function(){
    it('should be null when no query is given', function(done){
      var app = createApp();
      
      request(app)
       .get('/')
       .expect('', done);
    });

    it('should be an empty string when an empty query is given', function(done){
      var app = createApp();
      
      request(app)
       .get('/test?')
       .expect('', done);
    });

    it('should mirror the query string if one is given', function (done) {
      var app = createApp();

      request(app)
       .get('/?query=string&another')
       .expect('query=string&another', done);
    });
  })
})

function createApp() {
  var app = express();

  app.use(function (req, res) {
    res.send(req.rawQuery);
  });

  return app;
}