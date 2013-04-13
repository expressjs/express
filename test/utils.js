
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

describe('utils.escape(html)', function(){
  it('should escape html entities', function(){
    utils.escape('<script>foo & "bar"')
      .should.equal('&lt;script&gt;foo &amp; &quot;bar&quot;')
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
    var arr = utils.parseParams(str);
    arr[0].value.should.equal('en');
    arr[1].value.should.equal('nl');
    arr[2].value.should.equal('fr');
    arr[4].value.should.equal('de');
    arr[5].value.should.equal('ja');
    arr[6].value.should.equal('it');
    arr[7].value.should.equal('es');
    arr[8].value.should.equal('pt');
    arr[9].value.should.equal('pt-PT');
    arr[10].value.should.equal('da');
    arr[11].value.should.equal('fi');
    arr[12].value.should.equal('nb');
    arr[13].value.should.equal('sv');
    arr[14].value.should.equal('ko');
    arr[15].value.should.equal('zh-Hans');
    arr[16].value.should.equal('zh-Hant');
    arr[17].value.should.equal('ru');
    arr[18].value.should.equal('pl');
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
})
