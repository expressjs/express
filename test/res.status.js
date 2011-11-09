
var express = require('../')
  , res = require('http').ServerResponse.prototype;

describe('res', function(){
  describe('.status()', function(){
    it('should set the response .statusCode', function(){
      var obj = {};
      res.status.call(obj, 200).should.equal(obj);
      obj.statusCode.should.equal(200);
    })
  })
})
