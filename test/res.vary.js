
var express = require('../')
  , should = require('should');

function response() {
  var res = Object.create(express.response);
  res._headers = {};
  return res;
}

describe('res.vary()', function(){
  describe('with no arguments', function(){
    it('should not set Vary', function(){
      var res = response();
      res.vary();
      should.not.exist(res.get('Vary'));
    })
  })

  describe('with an empty array', function(){
    it('should not set Vary', function(){
      var res = response();
      res.vary([]);
      should.not.exist(res.get('Vary'));
    })
  })

  describe('with an array', function(){
    it('should set the values', function(){
      var res = response();
      res.vary(['Accept', 'Accept-Language', 'Accept-Encoding']);
      res.get('Vary').should.equal('Accept, Accept-Language, Accept-Encoding');
    })
  })

  describe('with a string', function(){
    it('should set the value', function(){
      var res = response();
      res.vary('Accept');
      res.get('Vary').should.equal('Accept');
    })
  })

  describe('when the value is present', function(){
    it('should not add it again', function(){
      var res = response();
      res.vary('Accept');
      res.vary('Accept-Encoding');
      res.vary('Accept-Encoding');
      res.vary('Accept-Encoding');
      res.vary('Accept');
      res.get('Vary').should.equal('Accept, Accept-Encoding');
    })
  })
})
