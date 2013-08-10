
var express = require('../')
  , res = express.response;

describe('res', function(){
  describe('.vary() - Accept only', function(){
    it('should set Vary to Accept', function(){
      res.vary();
      res.get('Vary').should.equal('Accept');
    });
  });

  describe('.vary(headers) - normal usage', function(){
    it('should set Vary to Accept-Language, Accept-Encoding, Accept', function(){
      res.vary(['Accept-Language', 'Accept-Encoding']);
      res.get('Vary').should.equal('Accept-Language, Accept-Encoding, Accept');
    });
  });

  describe('.vary(headers, false) - prevent automatic Accept creation', function(){
    it('should set Vary to Accept-Language, Accept-Encoding', function(){
      res.vary(['Accept-Language', 'Accept-Encoding'], false);
      res.get('Vary').should.equal('Accept-Language, Accept-Encoding');
    });
  });

  describe('.vary(headers, true) - enable automatic Accept creation', function(){
    it('should set Vary to Accept-Language, Accept-Encoding, Accept', function(){
      res.vary(['Accept-Language', 'Accept-Encoding'], true);
      res.get('Vary').should.equal('Accept-Language, Accept-Encoding, Accept');
    });
  });

  describe('.vary(headers) - prevent duplicate Accept', function(){
    it('should set Vary to Accept, Accept-Language, Accept-Encoding', function(){
      res.vary(['Accept', 'Accept-Language', 'Accept-Encoding']);
      res.get('Vary').should.equal('Accept, Accept-Language, Accept-Encoding');
    });
  });

  describe('.vary([]) - empty headers array', function(){
    it('should set Vary to Accept', function(){
      res.vary([]);
      res.get('Vary').should.equal('Accept');
    });
  });
});
