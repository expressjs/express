'use strict'

var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.acceptsCharsets(type)', function(){
    describe('when Accept-Charset is not present', function(){
      it('should return true', function(done){
        var app = express();

        app.use(function(req, res, next){
          res.end(req.acceptsCharsets('utf-8') ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .expect('yes', done);
      })
    })

    describe('when Accept-Charset is present', function () {
      it('should return true', function (done) {
        var app = express();

        app.use(function(req, res, next){
          res.end(req.acceptsCharsets('utf-8') ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .set('Accept-Charset', 'foo, bar, utf-8')
        .expect('yes', done);
      })

      it('should return false otherwise', function(done){
        var app = express();

        app.use(function(req, res, next){
          res.end(req.acceptsCharsets('utf-8') ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .set('Accept-Charset', 'foo, bar')
        .expect('no', done);
      })

      it('should return the best matching charset from multiple inputs', function (done) {
        var app = express();

        app.use(function(req, res, next){
          res.end(req.acceptsCharsets('utf-8', 'iso-8859-1'));
        });

        request(app)
        .get('/')
        .set('Accept-Charset', 'iso-8859-1, utf-8')
        .expect('iso-8859-1', done);
      })
    })
  })
})
