
var express = require('../');

describe('express', function(){
  describe('exports', function(){
    it('should have .version', function(){
      express.should.have.property('version');
    })
    
    it('should expose connect middleware', function(){
      express.should.have.property('bodyParser');
      express.should.have.property('session');
      express.should.have.property('static');
    })
    
    it('should expose HTTP methods', function(){
      express.methods.should.be.an.instanceof(Array);
      express.methods.should.contain('get');
      express.methods.should.contain('put');
      express.methods.should.contain('post');
    })
  })
})