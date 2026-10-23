'use strict'

var express = require('..');
var request = require('supertest');

describe('res', function(){
  describe('.links(obj)', function(){
    it('should set Link header field', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.links({
          next: 'http://api.example.com/users?page=2',
          last: 'http://api.example.com/users?page=5'
        });
        res.end();
      });

      request(app)
      .get('/')
      .expect('Link', '<http://api.example.com/users?page=2>; rel="next", <http://api.example.com/users?page=5>; rel="last"')
      .expect(200, done);
    })

    it('should set Link header field for multiple calls', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.links({
          next: 'http://api.example.com/users?page=2',
          last: 'http://api.example.com/users?page=5'
        });

        res.links({
          prev: 'http://api.example.com/users?page=1'
        });

        res.end();
      });

      request(app)
      .get('/')
      .expect('Link', '<http://api.example.com/users?page=2>; rel="next", <http://api.example.com/users?page=5>; rel="last", <http://api.example.com/users?page=1>; rel="prev"')
      .expect(200, done);
    })

    it('should set multiple links for single rel', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.links({
          next: 'http://api.example.com/users?page=2',
          last: ['http://api.example.com/users?page=5', 'http://api.example.com/users?page=1']
        });

        res.end();
      });

      request(app)
      .get('/')
      .expect('Link', '<http://api.example.com/users?page=2>; rel="next", <http://api.example.com/users?page=5>; rel="last", <http://api.example.com/users?page=1>; rel="last"')
      .expect(200, done);
    })

    it('should skip empty-array rel values without producing trailing commas', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.links({
          next: 'http://api.example.com/users?page=2',
          prev: []
        });

        res.end();
      });

      request(app)
      .get('/')
      .expect('Link', '<http://api.example.com/users?page=2>; rel="next"')
      .expect(200, done);
    })

    it('should not set a trailing comma when appending and new rel values are all empty arrays', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.links({ next: 'http://api.example.com/users?page=2' });
        res.links({ prev: [] });
        res.end();
      });

      request(app)
      .get('/')
      .expect('Link', '<http://api.example.com/users?page=2>; rel="next"')
      .expect(200, done);
    })
  })
})
