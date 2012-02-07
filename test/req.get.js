
var express = require('../')
  , request = require('./support/http');

describe('req', function(){
  describe('.get(field)', function(){
    it('should return the header field value', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.get('Content-Type'));
      });

      request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .end(function(res){
        res.body.should.equal('application/json');
        done();
      });
    })

    it('should special-case Referer', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.get('Referer'));
      });

      request(app)
      .post('/')
      .set('Referrer', 'http://foobar.com')
      .end(function(res){
        res.body.should.equal('http://foobar.com');
        done();
      });
    })
  })
})