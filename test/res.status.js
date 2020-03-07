
var express = require('../')
  , res = require('../lib/response')
  , request = require('supertest')
  , assert = require('assert');

describe('res', function(){
  describe('.status(code)', function(){
    it('should set the response .statusCode', function(done){
      var app = express();

      app.use(function(req, res){
        res.status(201).end('Created');
      });

      request(app)
      .get('/')
      .expect('Created')
      .expect(201, done);
    })

    describe('should throw', function() {
      var InvalidStatusError = new TypeError('Invalid status code')

      it('if status code is < 100 || > 999', function(done) {
        assert.throws(function() {
          res.status(99)
        }, InvalidStatusError, "for value 99")
        assert.throws(function() {
          res.status(1000)
        }, InvalidStatusError, "for value 1000")
        done()
      })
      it('if status code is not an integer', function (done) {
        var cases = [
          200.1,
          '200.1',
          NaN,
          Infinity,
          -Infinity,
          undefined,
          null,
          function () {},
          true,
          false,
        {},
        [],
        ]
        cases.forEach(function (item) {
          assert.throws(function () {
            res.status(item)
          }, InvalidStatusError)
        })
        done()
      })

    })
  })
})
