
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.acceptsCharset(type)', function(){
    describe('when Accept-Charset is not present', function(){
      it('should return true', function(done){
        var app = express();

        app.use(function(req, res, next){
          res.end(req.acceptsCharset('utf-8') ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .expect('yes', done);
      })
    })

    describe('when Accept-Charset is not present', function(){
      it('should return true when present', function(done){
        var app = express();

        app.use(function(req, res, next){
          res.end(req.acceptsCharset('utf-8') ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .set('Accept-Charset', 'foo, bar, utf-8')
        .expect('yes', done);
      })

      it('should return false otherwise', function(done){
        var app = express();

        app.use(function(req, res, next){
          res.end(req.acceptsCharset('utf-8') ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .set('Accept-Charset', 'foo, bar')
        .expect('no', done);
      })
    })
  })
})
