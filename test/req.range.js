
var assert = require('assert');
var express = require('..');

function req(ret) {
  return {
      get: function(){ return ret }
    , __proto__: express.request
  };
}

describe('req', function(){
  describe('.range(size)', function(){
    it('should return parsed ranges', function(){
      var ranges = [{ start: 0, end: 50 }, { start: 51, end: 100 }]
      ranges.type = 'bytes'
      assert.deepEqual(req('bytes=0-50,51-100').range(120), ranges)
    })

    it('should cap to the given size', function(){
      var ret = [{ start: 0, end: 74 }];
      ret.type = 'bytes';
      req('bytes=0-100').range(75).should.eql(ret);
    })

    it('should have a .type', function(){
      var ret = [{ start: 0, end: Infinity }];
      ret.type = 'users';
      req('users=0-').range(Infinity).should.eql(ret);
    })

    it('should return undefined if no range', function(){
      var ret = [{ start: 0, end: 50 }, { start: 60, end: 100 }];
      ret.type = 'bytes';
      assert(req('').range(120) === undefined);
    })
  })

  describe('.range(size, options)', function(){
    describe('with "combine: true" option', function(){
      it('should return combined ranges', function(){
        var ranges = [{ start: 0, end: 100 }]
        ranges.type = 'bytes'
        assert.deepEqual(req('bytes=0-50,51-100').range(120, { combine: true }), ranges)
      })
    })
  })
})
