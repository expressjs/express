
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.xhr', function(){
    it('should return true when X-Requested-With is xmlhttprequest', function(done){
      var app = express();

      app.use(function(req, res){
        req.xhr.should.be.true()
        res.end();
      });

      request(app)
      .get('/')
      .set('X-Requested-With', 'xmlhttprequest')
      .expect(200)
      .end(function(err, res){
        done(err);
      })
    })

    it('should case-insensitive', function(done){
      var app = express();

      app.use(function(req, res){
        req.xhr.should.be.true()
        res.end();
      });

      request(app)
      .get('/')
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect(200)
      .end(function(err, res){
        done(err);
      })
    })

    it('should return false otherwise', function(done){
      var app = express();

      app.use(function(req, res){
        req.xhr.should.be.false()
        res.end();
      });

      request(app)
      .get('/')
      .set('X-Requested-With', 'blahblah')
      .expect(200)
      .end(function(err, res){
        done(err);
      })
    })

    it('should return false when not present', function(done){
      var app = express();

      app.use(function(req, res){
        req.xhr.should.be.false()
        res.end();
      });

      request(app)
      .get('/')
      .expect(200)
      .end(function(err, res){
        done(err);
      })
    })
  })
})
