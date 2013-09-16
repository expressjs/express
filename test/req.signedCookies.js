
var express = require('../')
  , request = require('./support/http');

describe('req', function(){
  describe('.signedCookies', function(){
    it('should return a signed JSON cookie', function(done){
      var app = express();

      var replacer = app.get('json replacer');
      var spaces = app.get('json spaces');

      app.use(express.cookieParser('secret'));

      app.use(function(req, res){
        res.send(req.signedCookies);
      });

      app.response.req = { secret: 'secret' };
      app.response.cookie('obj', { foo: 'bar' }, { signed: true });
      var cookie = app.response.get('set-cookie').split(';')[0];

      var val = JSON.stringify({ obj: { foo: 'bar' } }, replacer, spaces);
      
      request(app)
      .get('/')
      .set('Cookie', cookie)
      .expect(val, done);
    })

    it('should return a signed cookie', function(done){
      var app = express();

      var replacer = app.get('json replacer');
      var spaces = app.get('json spaces');

      app.use(express.cookieParser('secret'));

      app.use(function(req, res){
        res.send(req.signedCookies);
      });

      app.response.req = { secret: 'secret' };
      app.response.cookie('foo', 'bar', { signed: true });
      var cookie = app.response.get('set-cookie');

      var val = JSON.stringify({ foo: 'bar' }, replacer, spaces);
      
      request(app)
      .get('/')
      .set('Cookie', cookie)
      .expect(val, done);
    })
  })
})

