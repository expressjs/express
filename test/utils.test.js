
/**
 * Module dependencies.
 */

var utils = require('express/utils');

module.exports = {
    'test .miniMarkdown()': function(assert){
        assert.equal('<em>foo</em>', utils.miniMarkdown('_foo_'));
        assert.equal('<em>foo</em>', utils.miniMarkdown('*foo*'));
        assert.equal('<strong>foo</strong>', utils.miniMarkdown('**foo**'));
        assert.equal('<strong>foo</strong>', utils.miniMarkdown('__foo__'));
        assert.equal('<em>foo</em>_', utils.miniMarkdown('_foo__'));
        assert.equal('<a href="/login">User Login</a>', utils.miniMarkdown('[User Login](/login)'));
    },
    
    'test .parseRange()': function(assert){
        assert.eql([{start: 0, end: 499 }], utils.parseRange(1000, 'bytes=0-499'));
        assert.eql([{start: 40, end: 80 }], utils.parseRange(1000, 'bytes=40-80'));
        assert.eql([{start: 500, end: 999 }], utils.parseRange(1000, 'bytes=-500'));
        assert.eql([{start: 500, end: 999 }], utils.parseRange(1000, 'bytes=500-'));
        assert.eql([{start: 0, end: 0 }], utils.parseRange(1000, 'bytes=0-0'));
        assert.eql([{start: 999, end: 999 }], utils.parseRange(1000, 'bytes=-1'));
    }
};