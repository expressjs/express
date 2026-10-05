'use strict'

var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.acceptsCharsets(type)', function(){
    describe('when Accept-Charset is not present', function(){
      it('should return the charset', function(done){
        var app = express();

        app.use(function(req, res, next){
          res.json({
            'utf-8': req.acceptsCharsets('utf-8')
          });
        });

        request(app)
        .get('/')
        .expect({ 'utf-8': 'utf-8' }, done);
      })
    })

    describe('when Accept-Charset is present', function () {
      it('should return the charset', function (done) {
        var app = express();

        app.use(function(req, res, next){
          res.json({
            'foo': req.acceptsCharsets('foo'),
            'bar': req.acceptsCharsets('bar'),
            'utf-8': req.acceptsCharsets('utf-8')
          });
        });

        request(app)
        .get('/')
        .set('Accept-Charset', 'foo, bar, utf-8')
        .expect({ foo: 'foo', bar: 'bar', 'utf-8': 'utf-8' }, done);
      })

      it('should return false otherwise', function(done){
        var app = express();

        app.use(function(req, res, next){
          res.json({
            'utf-8': req.acceptsCharsets('utf-8')
          });
        });

        request(app)
        .get('/')
        .set('Accept-Charset', 'foo, bar')
        .expect({ 'utf-8': false }, done);
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

      it('should accept an array of charsets', function (done) {
        var app = express();

        app.use(function(req, res, next){
          res.end(req.acceptsCharsets(['utf-8', 'iso-8859-1']));
        });

        request(app)
        .get('/')
        .set('Accept-Charset', 'iso-8859-1, utf-8')
        .expect('iso-8859-1', done);
      })
    })
  })

  describe('.acceptsCharsets()', function(){
    describe('when Accept-Charset is not present', function () {
      it('should return an array with *', function (done) {
        var app = express();

        app.use(function(req, res, next){
          res.send(req.acceptsCharsets());
        });

        request(app)
        .get('/')
        .expect(['*'], done);
      })
    })

    describe('when Accept-Charset is present', function () {
      it('should return an array of accepted charsets in order of client\'s preference', function (done) {
        var app = express();

        app.use(function(req, res, next){
          res.send(req.acceptsCharsets());
        });

        request(app)
        .get('/')
        .set('Accept-Charset', 'iso-8859-1; q=0.5, utf-8')
        .expect(['utf-8', 'iso-8859-1'], done);
      })
    })
  })
})
