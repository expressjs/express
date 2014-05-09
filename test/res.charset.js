
var express = require('../')
  , request = require('supertest');

describe('res', function(){
  describe('.charset', function(){
    it('should add the charset param to Content-Type', function(done){
      var app = express();

      app.use(function(req, res){
        res.charset = 'utf-8';
        res.set('Content-Type', 'text/x-foo');
        res.end(res.get('Content-Type'));
      });

      request(app)
      .get('/')
      .expect("text/x-foo; charset=utf-8", done);
    })

    it('should be replaced by real charset in res.send', function(done){
      var app = express();

      app.use(function(req, res){
        res.charset = 'whoop';
        res.send('hey');
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8', done);
    })
  })
})
