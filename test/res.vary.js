
var express = require('../')
  , should = require('should')
  , res = express.response;

describe('res', function(){
  describe('.vary() - undefined', function(){
    it('should not set Vary', function(){
      res.vary();
      should.not.exist(res.get('Vary'));
    });
  });

  describe('.vary([]) - undefined', function(){
    it('should not set Vary', function(){
      res.vary([]);
      should.not.exist(res.get('Vary'));
    });
  });

  describe('.vary(headers) - normal usage', function(){
    it('should set Vary to Accept, Accept-Language, Accept-Encoding', function(){
      res.vary(['Accept', 'Accept-Language', 'Accept-Encoding']);
      res.get('Vary').should.equal('Accept, Accept-Language, Accept-Encoding');
    });
  });

  describe('.vary(\'headers\') - single Accept header', function(){
    it('should set Vary to Accept', function(){
      res.vary('Accept');
      res.get('Vary').should.equal('Accept');
    });
  });
});
