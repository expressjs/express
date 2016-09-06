var assert = require('assert');
var express = require('..');
var methods = require('methods');
var request = require('supertest');
var utils = require('./support/utils');

describe('res', function(){
  describe('.end()', function(){
    describe('when .statusCode is 204', function(){
      it('should strip Content-* fields, Transfer-Encoding field, and body', function(done){
        var app = express();

        app.use(function(req, res){
          res.status(204).set('Transfer-Encoding', 'chunked').end();
        });

        request(app)
        .get('/')
        .expect(utils.shouldNotHaveHeader('Content-Type'))
        .expect(utils.shouldNotHaveHeader('Content-Length'))
        .expect(utils.shouldNotHaveHeader('Transfer-Encoding'))
        .expect(204, '', done);
      })
    })

    describe('when .statusCode is 304', function(){
      it('should strip Content-* fields, Transfer-Encoding field, and body)', function(done){
        var app = express();

        app.use(function(req, res){
          res.status(304).set('Transfer-Encoding', 'chunked').end();
        });

        request(app)
        .get('/')
        .expect(utils.shouldNotHaveHeader('Content-Type'))
        .expect(utils.shouldNotHaveHeader('Content-Length'))
        .expect(utils.shouldNotHaveHeader('Transfer-Encoding'))
        .expect(304, '', done);
      })
    })
  })
})
