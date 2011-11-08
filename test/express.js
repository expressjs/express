
var express = require('../');

describe('express', function(){
  describe('exports', function(){
    it('should have a .version', function(){
      express.should.have.property('version');
    })
  })
})