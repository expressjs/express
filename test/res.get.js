
var express = require('../')
  , res = express.response;

describe('res', function(){
  describe('.get(field)', function(){
    it('should get the response header field', function(){
      res.setHeader('Content-Type', 'text/x-foo');
      res.get('Content-Type').should.equal('text/x-foo');
      res.get('Content-type').should.equal('text/x-foo');
      res.get('content-type').should.equal('text/x-foo');
    })
  })
})
