

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

describe('utils.parseAccepts(str)', function(){
  it('should default quality to 1', function(){
    utils.parseAccepts('text/html')
      .should.eql([{ type: 'text/html', quality: 1 }]);
  })
  
  it('should parse qvalues', function(){
    utils.parseAccepts('text/html; q=0.5')
      .should.eql([{ type: 'text/html', quality: 0.5 }]);

    utils.parseAccepts('text/html; q=.2')
      .should.eql([{ type: 'text/html', quality: 0.2 }]);
  })
  
  it('should work with messed up whitespace', function(){
    utils.parseAccepts('text/html   ;  q =   .2')
      .should.eql([{ type: 'text/html', quality: 0.2 }]);
  })
  
  it('should sort by quality', function(){
    var str = 'text/plain;q=.2, application/json, text/html;q=0.5';
    var arr = utils.parseAccepts(str);
    arr[0].type.should.equal('application/json');
    arr[1].type.should.equal('text/html');
    arr[2].type.should.equal('text/plain');
  })
})