
var utils = require('../lib/utils')
  , assert = require('assert');

describe('utils.etag(body)', function(){

  var str = 'Hello CRC';
  var strUTF8 = '<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body><p>自動販売</p></body></html>';

  it('should support strings', function(){
    utils.etag(str).should.eql('"-2034458343"');
  })

  it('should support utf8 strings', function(){
    utils.etag(strUTF8).should.eql('"1395090196"');
  })

  it('should support buffer', function(){
    utils.etag(new Buffer(strUTF8)).should.eql('"1395090196"');
    utils.etag(new Buffer(str)).should.eql('"-2034458343"');
  })

})

describe('utils.isAbsolute()', function(){
  it('should support windows', function(){
    assert(utils.isAbsolute('c:\\'));
    assert(!utils.isAbsolute(':\\'));
  })

  it('should unices', function(){
    assert(utils.isAbsolute('/foo/bar'));
    assert(!utils.isAbsolute('foo/bar'));
  })
})

describe('utils.flatten(arr)', function(){
  it('should flatten an array', function(){
    var arr = ['one', ['two', ['three', 'four'], 'five']];
    utils.flatten(arr)
      .should.eql(['one', 'two', 'three', 'four', 'five']);
  })
})
