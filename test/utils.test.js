
/**
 * Module dependencies.
 */

var utils = require('../lib/utils')
  , should = require('should');

module.exports = {
  'test .miniMarkdown()': function(){
    utils.miniMarkdown('_foo_').should.equal('<em>foo</em>');
    utils.miniMarkdown('*foo*').should.equal('<em>foo</em>');
    utils.miniMarkdown('**foo**').should.equal('<strong>foo</strong>');
    utils.miniMarkdown('__foo__').should.equal('<strong>foo</strong>');
    utils.miniMarkdown('_foo__').should.equal('<em>foo</em>_');  
    utils.miniMarkdown('[User Login](/login)').should.equal('<a href="/login">User Login</a>');
  },
  
  'test .parseRange()': function(){
    utils.parseRange(1000, 'bytes=0-499').should.eql([{ start: 0, end: 499 }]);
    utils.parseRange(1000, 'bytes=40-80').should.eql([{ start: 40, end: 80 }]);
    utils.parseRange(1000, 'bytes=-500').should.eql([{ start: 500, end: 999 }]);
    utils.parseRange(1000, 'bytes=-400').should.eql([{ start: 600, end: 999 }]);
    utils.parseRange(1000, 'bytes=500-').should.eql([{ start: 500, end: 999 }]);
    utils.parseRange(1000, 'bytes=400-').should.eql([{ start: 400, end: 999 }]);
    utils.parseRange(1000, 'bytes=0-0').should.eql([{ start: 0, end: 0 }]);
    utils.parseRange(1000, 'bytes=-1').should.eql([{ start: 999, end: 999 }]);
  }
};