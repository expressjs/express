
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

describe('utils.setCharset(type, charset)', function () {
  it('should do anything without type', function () {
    assert.strictEqual(utils.setCharset(), undefined);
  });

  it('should return type if not given charset', function () {
    assert.strictEqual(utils.setCharset('text/html'), 'text/html');
  });

  it('should keep charset if not given charset', function () {
    assert.strictEqual(utils.setCharset('text/html; charset=utf-8'), 'text/html; charset=utf-8');
  });

  it('should set charset', function () {
    assert.strictEqual(utils.setCharset('text/html', 'utf-8'), 'text/html; charset=utf-8');
  });

  it('should override charset', function () {
    assert.strictEqual(utils.setCharset('text/html; charset=iso-8859-1', 'utf-8'), 'text/html; charset=utf-8');
  });
});

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
