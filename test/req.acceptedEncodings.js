
var express = require('../')
  , request = require('./support/http');

describe('req', function(){
  describe('.acceptedEncodings', function(){
    it('should return an array of accepted encodings', function(done){
      var app = express();

      app.use(function(req, res){
        req.acceptedEncodings.should.eql(['gzip', 'deflate']);
        res.end();
      });

      request(app)
      .get('/')
      .set('Accept-Encoding', ' gzip, deflate')
      .expect(200, done);
    })

    describe('when Accept-Encoding is not present', function(){
      it('should default to [\'gzip\', \'deflate\']', function(done){
        var app = express();

        app.use(function(req, res){
          req.acceptedEncodings.should.eql(['gzip', 'deflate']);
          res.end();
        });

        request(app)
        .get('/')
        .expect(200, done);
      })
    })
  })
})
