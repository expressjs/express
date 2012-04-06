
var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.signedCookie(name, object)', function(){
    it('should generate a signed JSON cookie', function(done){
      var app = express();

      app.use(express.cookieParser('foo bar baz'));

      app.use(function(req, res){
        res.signedCookie('user', { name: 'tobi' }).end();
      });
  
      request(app)
      .get('/')
      .end(function(res){
        var val = res.headers['set-cookie'][0];
        val = decodeURIComponent(val.split('.')[0]);
        val.should.equal('user=j:{"name":"tobi"}');
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
        var val = ['name=tobi.xJjV2iZ6EI7C8E5kzwbfA9PVLl1ZR07UTnuTgQQ4EnQ; path=/'];
        res.headers['set-cookie'].should.eql(val);
        done();
      })
    })
  })
})
