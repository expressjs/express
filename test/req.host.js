
var express = require('../');

function req(ret) {
  return {
      get: function(){ return ret }
    , __proto__: express.request
  };
}

describe('req', function(){
  describe('.host', function(){
    it('should return hostname', function(){
      req('example.com:3000').host.should.equal('example.com');
      req('example.com').host.should.equal('example.com');
    })
  })
})
