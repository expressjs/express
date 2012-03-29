
var express = require('../')
  , request = require('./support/http');

describe('req', function(){
  describe('.ips', function(){
    describe('when X-Forwarded-For is present', function(){
      it('should return an array of the specified addresses', function(done){
        var app = express();

        app.use(function(req, res, next){
          res.send(req.ips);
        });

        request(app)
        .get('/')
        .set('X-Forwarded-For', 'client, proxy')
        .expect('["client","proxy"]', done);
      })
    })

    describe('when X-Forwarded-For is not present', function(){
      it('should return []', function(done){
        var app = express();

        app.use(function(req, res, next){
          res.send(req.ips);
        });

        request(app)
        .get('/')
        .expect('[]', done);
      })
    })
  })
})
