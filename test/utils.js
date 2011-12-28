
var utils = require('../lib/utils')
  , assert = require('assert');

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

describe('utils.parseQuality(str)', function(){
  it('should default quality to 1', function(){
    utils.parseQuality('text/html')
      .should.eql([{ value: 'text/html', quality: 1 }]);
  })
  
  it('should parse qvalues', function(){
    utils.parseQuality('text/html; q=0.5')
      .should.eql([{ value: 'text/html', quality: 0.5 }]);

    utils.parseQuality('text/html; q=.2')
      .should.eql([{ value: 'text/html', quality: 0.2 }]);
  })
  
  it('should work with messed up whitespace', function(){
    utils.parseQuality('text/html   ;  q =   .2')
      .should.eql([{ value: 'text/html', quality: 0.2 }]);
  })
  
  it('should work with multiples', function(){
    var str = 'da, en;q=.5, en-gb;q=.8';
    var arr = utils.parseQuality(str);
    arr[0].value.should.equal('da');
    arr[1].value.should.equal('en-gb');
    arr[2].value.should.equal('en');
  })
  
  it('should sort by quality', function(){
    var str = 'text/plain;q=.2, application/json, text/html;q=0.5';
    var arr = utils.parseQuality(str);
    arr[0].value.should.equal('application/json');
    arr[1].value.should.equal('text/html');
    arr[2].value.should.equal('text/plain');
  })
  
  it('should exclude those with a quality of 0', function(){
    var str = 'text/plain;q=.2, application/json, text/html;q=0';
    var arr = utils.parseQuality(str);
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
    it('should return true', function(){
      utils.accepts('text/html')
        .should.be.true;
    })
  })
  
  describe('when a string is empty', function(){
    it('should return true', function(){
      utils.accepts('text/html', '')
        .should.be.true;
    })
  })
  
  describe('when */* is given', function(){
    it('should return true', function(){
      utils.accepts('text/html', 'text/plain, */*')
        .should.be.true;
    })
  })

  describe('when accepting type/subtype', function(){
    it('should return true when present', function(){
      utils.accepts('text/html', 'text/plain, text/html')
        .should.be.true;
    })
    
    it('should return false otherwise', function(){
      utils.accepts('text/html', 'text/plain, application/json')
        .should.be.false;
    })
  })
  
  describe('when accepting */subtype', function(){
    it('should return true when present', function(){
      utils.accepts('text/html', 'text/*')
        .should.be.true;
    })
    
    it('should return false otherwise', function(){
      utils.accepts('text/html', 'image/*')
        .should.be.false;
    })
  })
  
  describe('when accepting type/*', function(){
    it('should return true when present', function(){
      utils.accepts('text/html', '*/html')
        .should.be.true;
    })
    
    it('should return false otherwise', function(){
      utils.accepts('text/html', '*/json')
        .should.be.false;
    })
  })
  
  describe('when an extension is given', function(){
    it('should return true when present', function(){
      utils.accepts('html', 'text/html, application/json')
        .should.be.true;
    })
    
    it('should return false otherwise', function(){
      utils.accepts('html', 'text/plain, application/json')
        .should.be.false;
    })
    
    it('should support *', function(){
      utils.accepts('html', 'text/*')
        .should.be.true;

      utils.accepts('html', '*/html')
        .should.be.true;
    })
  })
})