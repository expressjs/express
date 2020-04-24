
var express = require('../')
  , request = require('supertest');

describe('res', function(){
  describe('.clearCookie(name)', function(){
    it('should set a cookie passed expiry', function(done){
      var app = express();

      app.use(function(req, res){
        res.clearCookie('sid').end();
      });

      request(app)
      .get('/')
      .expect('Set-Cookie', 'sid=; Max-Age=0; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
      .expect(200, done)
    })
  })

  describe('.clearCookie(name, options)', function(){
    it('should set the given params', function(done){
      var app = express();

      app.use(function(req, res){
        res.clearCookie('sid', { path: '/admin' }).end();
      });

      request(app)
      .get('/')
      .expect('Set-Cookie', 'sid=; Max-Age=0; Path=/admin; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
      .expect(200, done)
    })

    it('should override \'expires\' property', function(done) {
      var app = express();

      app.use(function(req, res) {
        res.clearCookie('sid', {expires: new Date()}).end();
      });

      request(app)
        .get('/')
        .expect('Set-Cookie', 'sid=; Max-Age=0; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
        .expect(200, done)
    });

    it('should override \'maxAge\' property', function(done) {
      var app = express();

      app.use(function(req, res) {
        res.clearCookie('sid', {maxAge: 10000}).end();
      });

      request(app)
        .get('/')
        .expect('Set-Cookie', 'sid=; Max-Age=0; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
        .expect(200, done)
    });
  })
})
