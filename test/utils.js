
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
    .should.eql('W/"8-3098196679"')
  })

  it('should support utf8 strings', function(){
    utils.wetag('express❤', 'utf8')
    .should.eql('W/"a-1751845617"')
  })

  it('should support buffer', function(){
    var buf = new Buffer('express!')
    utils.wetag(buf)
    .should.eql('W/"8-3098196679"');
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

describe('utils.parseParams(str)', function(){
  it('should default quality to 1', function(){
    utils.parseParams('text/html')
      .should.eql([{ value: 'text/html', quality: 1, params: {}, originalIndex: 0 }]);
  })

  it('should parse qvalues', function(){
    utils.parseParams('text/html; q=0.5')
      .should.eql([{ value: 'text/html', quality: 0.5, params: {}, originalIndex: 0 }]);

    utils.parseParams('text/html; q=.2')
      .should.eql([{ value: 'text/html', quality: 0.2, params: {}, originalIndex: 0 }]);
  })

  it('should parse accept parameters', function(){
    utils.parseParams('application/json; ver=2.0')
      .should.eql([{ value: 'application/json', quality: 1, params: {ver: "2.0"}, originalIndex: 0 }]);

    utils.parseParams('text/html; q=0.5; level=2')
      .should.eql([{ value: 'text/html', quality: 0.5, params: {level: "2"}, originalIndex: 0 }]);
    utils.parseParams('text/html;q=.2;ver=beta')
      .should.eql([{ value: 'text/html', quality: 0.2, params: {ver: "beta"}, originalIndex: 0 }]);
  })

  it('should work with messed up whitespace', function(){
    utils.parseParams('text/html   ;  q =   .2')
      .should.eql([{ value: 'text/html', quality: 0.2, params: {}, originalIndex: 0 }]);
  })

  it('should work with multiples', function(){
    var str = 'da, en;q=.5, en-gb;q=.8';
    var arr = utils.parseParams(str);
    arr[0].value.should.equal('da');
    arr[1].value.should.equal('en-gb');
    arr[2].value.should.equal('en');
  })

  it('should work with long lists', function(){
    var str = 'en, nl, fr, de, ja, it, es, pt, pt-PT, da, fi, nb, sv, ko, zh-Hans, zh-Hant, ru, pl';
    var arr = utils.parseParams(str).map(function(o){ return o.value });
    arr.should.eql(str.split(', '));
  })

  it('should sort by quality', function(){
    var str = 'text/plain;q=.2, application/json, text/html;q=0.5';
    var arr = utils.parseParams(str);
    arr[0].value.should.equal('application/json');
    arr[1].value.should.equal('text/html');
    arr[2].value.should.equal('text/plain');
  })

  it('should exclude those with a quality of 0', function(){
    var str = 'text/plain;q=.2, application/json, text/html;q=0';
    var arr = utils.parseParams(str);
    arr.should.have.length(2);
  })
})

describe('utils.parseAccept(str)', function(){
  it('should provide .type', function(){
    var arr = utils.parseAccept('text/html');
    arr[0].type.should.equal('text');
  })

  it('should provide .subtype', function(){
    var arr = utils.parseAccept('text/html');
    arr[0].subtype.should.equal('html');
  })
})

describe('utils.accepts(type, str)', function(){
  describe('when a string is not given', function(){
    it('should return the value', function(){
      utils.accepts('text/html')
        .should.equal('text/html');
    })
  })

  describe('when a string is empty', function(){
    it('should return the value', function(){
      utils.accepts('text/html', '')
        .should.equal('text/html');
    })
  })

  describe('when */* is given', function(){
    it('should return the value', function(){
      utils.accepts('text/html', 'text/plain, */*')
        .should.equal('text/html');
    })
  })

  describe('when an array is given', function(){
    it('should return the best match', function(){
      utils.accepts(['html', 'json'], 'text/plain, application/json')
        .should.equal('json');

      utils.accepts(['html', 'application/json'], 'text/plain, application/json')
        .should.equal('application/json');

      utils.accepts(['text/html', 'application/json'], 'application/json;q=.5, text/html')
        .should.equal('text/html');
    })
  })

  describe('when a comma-delimited list is give', function(){
    it('should behave like an array', function(){
      utils.accepts('html, json', 'text/plain, application/json')
        .should.equal('json');

      utils.accepts('html, application/json', 'text/plain, application/json')
        .should.equal('application/json');

      utils.accepts('text/html, application/json', 'application/json;q=.5, text/html')
        .should.equal('text/html');
    })
  })

  describe('when accepting type/subtype', function(){
    it('should return the value when present', function(){
      utils.accepts('text/html', 'text/plain, text/html')
        .should.equal('text/html');
    })

    it('should return undefined otherwise', function(){
      assert(null == utils.accepts('text/html', 'text/plain, application/json'));
    })
  })

  describe('when accepting */subtype', function(){
    it('should return the value when present', function(){
      utils.accepts('text/html', 'text/*')
        .should.equal('text/html');
    })

    it('should return undefined otherwise', function(){
      assert(null == utils.accepts('text/html', 'image/*'));
    })
  })

  describe('when accepting type/*', function(){
    it('should return the value when present', function(){
      utils.accepts('text/html', '*/html')
        .should.equal('text/html');
    })

    it('should return undefined otherwise', function(){
      assert(null == utils.accepts('text/html', '*/json'));
    })
  })

  describe('when an extension is given', function(){
    it('should return the value when present', function(){
      utils.accepts('html', 'text/html, application/json')
        .should.equal('html');
    })

    it('should return undefined otherwise', function(){
      assert(null == utils.accepts('html', 'text/plain, application/json'));
    })

    it('should support *', function(){
      utils.accepts('html', 'text/*')
        .should.equal('html');

      utils.accepts('html', '*/html')
        .should.equal('html');
    })
  })

  describe('when params included', function(){
    it('should match params', function(){
      assert(null == utils.accepts('text/html; charset=us-ascii', 'text/html; charset=utf-8'));
    })
  })
})
