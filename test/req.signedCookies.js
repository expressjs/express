
var express = require('../')
  , request = require('./support/http');

describe('req', function(){
  describe('.signedCookies', function(){
    it('should unsign cookies', function(done){
      var app = express();

      app.use(express.cookieParser('foo bar baz'));

      app.use(function(req, res){
        req.cookies.should.not.have.property('name');
        res.end(req.signedCookies.name);
      });

      request(app)
      .get('/')
      .set('Cookie', 'name=tobi.2HDdGQqJ6jQU1S9dagggYDPaxGE')
      .end(function(res){
        res.body.should.equal('tobi');
        done();
      })
    })
    
    it('should parse JSON cookies', function(done){
      var app = express();

      app.use(express.cookieParser('foo bar baz'));

      app.use(function(req, res){
        req.cookies.should.not.have.property('user');
        res.end(req.signedCookies.user.name);
      });

      request(app)
      .get('/')
      .set('Cookie', 'user=j%3A%7B%22name%22%3A%22tobi%22%7D.aEbp4PGZo63zMX%2FcIMSn2M9pvms')
      .end(function(res){
        res.body.should.equal('tobi');
        done();
      })
    })

    describe('when signature is invalid', function(){
      it('should unsign cookies', function(done){
        var app = express();

        app.use(express.cookieParser('foo bar baz'));

        app.use(function(req, res){
          req.signedCookies.should.not.have.property('name');
          res.end(req.cookies.name);
        });

        request(app)
        .get('/')
        .set('Cookie', 'name=tobi.2HDdGQqJ6jQU1S9dagasdfasdf')
        .end(function(res){
          res.body.should.equal('tobi.2HDdGQqJ6jQU1S9dagasdfasdf');
          done();
        })
      })
    })
  })
})
