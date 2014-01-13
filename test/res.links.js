
var express = require('../')
  , res = express.response;

describe('res', function(){

  beforeEach(function() {
    res.removeHeader('link');
  });

  describe('.links(obj)', function(){
    it('should set Link header field', function(){
      res.links({
        next: 'http://api.example.com/users?page=2',
        last: 'http://api.example.com/users?page=5'
      });

      res.get('link')
      .should.equal(
          '<http://api.example.com/users?page=2>; rel="next", '
        + '<http://api.example.com/users?page=5>; rel="last"');
    })

    it('should set Link header field for multiple calls', function() {
      res.links({
        next: 'http://api.example.com/users?page=2',
        last: 'http://api.example.com/users?page=5'
      });

      res.links({
        prev: 'http://api.example.com/users?page=1',
      });

      res.get('link')
      .should.equal(
          '<http://api.example.com/users?page=2>; rel="next", '
        + '<http://api.example.com/users?page=5>; rel="last", '
        + '<http://api.example.com/users?page=1>; rel="prev"');
    })
  })
})
