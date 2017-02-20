
var assert = require('assert');
var utils = require('../lib/utils');

describe('utils.etag(body, encoding)', function(){
  it('should support strings', function(){
    utils.etag('express!')
    .should.eql('"8-zZdv4imtWD49AHEviejT6A"')
  })

  it('should support utf8 strings', function(){
    utils.etag('express❤', 'utf8')
    .should.eql('"a-fsFba4IxwQS6h6Umb+FNxw"')
  })

  it('should support buffer', function(){
    var buf = new Buffer('express!')
    utils.etag(buf)
    .should.eql('"8-zZdv4imtWD49AHEviejT6A"');
  })

  it('should support empty string', function(){
    utils.etag('')
    .should.eql('"0-1B2M2Y8AsgTpgAmY7PhCfg"');
  })
})

describe('utils.wetag(body, encoding)', function(){
  it('should support strings', function(){
    utils.wetag('express!')
    .should.eql('W/"8-zZdv4imtWD49AHEviejT6A"')
  })

  it('should support utf8 strings', function(){
    utils.wetag('express❤', 'utf8')
    .should.eql('W/"a-fsFba4IxwQS6h6Umb+FNxw"')
  })

  it('should support buffer', function(){
    var buf = new Buffer('express!')
    utils.wetag(buf)
    .should.eql('W/"8-zZdv4imtWD49AHEviejT6A"');
  })

  it('should support empty string', function(){
    utils.wetag('')
    .should.eql('W/"0-1B2M2Y8AsgTpgAmY7PhCfg"');
  })
})
