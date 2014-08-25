
var utils = require('../lib/utils')
  , assert = require('assert');

describe('utils.etag(body, encoding)', function(){
  it('should support strings', function(){
    utils.etag('express!')
    .should.eql('"zZdv4imtWD49AHEviejT6A=="')
  })

  it('should support utf8 strings', function(){
    utils.etag('express❤', 'utf8')
    .should.eql('"fsFba4IxwQS6h6Umb+FNxw=="')
  })

  it('should support buffer', function(){
    var buf = new Buffer('express!')
    utils.etag(buf)
    .should.eql('"zZdv4imtWD49AHEviejT6A=="');
  })

  it('should support empty string', function(){
    utils.etag('')
    .should.eql('"1B2M2Y8AsgTpgAmY7PhCfg=="');
  })
})

describe('utils.wetag(body, encoding)', function(){
  it('should support strings', function(){
    utils.wetag('express!')
    .should.eql('W/"8-b8aabac7"')
  })

  it('should support utf8 strings', function(){
    utils.wetag('express❤', 'utf8')
    .should.eql('W/"a-686b0af1"')
  })

  it('should support buffer', function(){
    var buf = new Buffer('express!')
    utils.wetag(buf)
    .should.eql('W/"8-b8aabac7"');
  })

  it('should support empty string', function(){
    utils.wetag('')
    .should.eql('W/"0-0"');
  })
})

describe('utils.isAbsolute()', function(){
  it('should support windows', function(){
    assert(utils.isAbsolute('c:\\'));
    assert(!utils.isAbsolute(':\\'));
  })

  it('should support windows unc', function(){
    assert(utils.isAbsolute('\\\\foo\\bar'))
  })

  it('should support unices', function(){
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
