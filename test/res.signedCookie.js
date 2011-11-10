
var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.signedCook(name, object)', function(){
    it('should generate a signed JSON cookie', function(done){
      var app = express();

      app.use(express.cookieParser('foo bar baz'));

      app.use(function(req, res){
        res.signedCookie('user', { name: 'tobi' }).end();
      });
  
      request(app)
      .get('/')
      .end(function(res){
        var val = ['user=j%3A%7B%22name%22%3A%22tobi%22%7D.aEbp4PGZo63zMX%2FcIMSn2M9pvms; path=/'];
        res.headers['set-cookie'].should.eql(val);
        done();
      })
    })
  })
  
  describe('.signedCookie(name, string)', function(){
    it('should set a signed cookie', function(done){
      var app = express();

      app.use(express.cookieParser('foo bar baz'));

      app.use(function(req, res){
        res.signedCookie('name', 'tobi').end();
      });
  
      request(app)
      .get('/')
      .end(function(res){
        var val = ['name=tobi.2HDdGQqJ6jQU1S9dagggYDPaxGE; path=/'];
        res.headers['set-cookie'].should.eql(val);
        done();
      })
    })
  })
})
