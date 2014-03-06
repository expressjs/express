
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.accepted', function(){
    it('should return an array of accepted media types', function(done){
      var app = express();

      app.use(function(req, res){
        req.accepted[0].value.should.equal('application/json');
        req.accepted[1].value.should.equal('text/html');
        res.end();
      });

      request(app)
      .get('/')
      .set('Accept', 'text/html;q=.5, application/json')
      .expect(200, done);
    })

    describe('when Accept is not present', function(){
      it('should default to []', function(done){
        var app = express();

        app.use(function(req, res){
          req.accepted.should.have.length(0);
          res.end();
        });

        request(app)
        .get('/')
        .expect(200, done);
      })
    })
  })
})
