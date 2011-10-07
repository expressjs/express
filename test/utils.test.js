
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
  }
};