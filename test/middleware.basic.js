
var express = require('../');
var request = require('supertest');

describe('middleware', function(){
  describe('.next()', function(){
    it('should behave like connect', function(done){
      var app = express()
        , calls = [];

      app.use(function(req, res, next){
        calls.push('one');
        next();
      });

      app.use(function(req, res, next){
        calls.push('two');
        next();
      });

      app.use(function(req, res){
        var buf = '';
        res.setHeader('Content-Type', 'application/json');
        req.setEncoding('utf8');
        req.on('data', function(chunk){ buf += chunk });
        req.on('end', function(){
          res.end(buf);
        });
      });

      request(app.listen())
      .get('/')
      .set('Content-Type', 'application/json')
      .send('{"foo":"bar"}')
      .end(function(err, res){
        if (err) return done(err);
        res.headers.should.have.property('content-type', 'application/json');
        res.statusCode.should.equal(200);
        res.text.should.equal('{"foo":"bar"}');
        done();
      })
    })
  })
})
