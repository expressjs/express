
/**
 * Module dependencies.
 */

var utils = require('express/utils');

module.exports = {
    'test miniMarkdown': function(assert){
        assert.equal('<em>foo</em>', utils.miniMarkdown('_foo_'));
        assert.equal('<em>foo</em>', utils.miniMarkdown('*foo*'));
        assert.equal('<strong>foo</strong>', utils.miniMarkdown('**foo**'));
        assert.equal('<strong>foo</strong>', utils.miniMarkdown('__foo__'));
        assert.equal('<em>foo</em>_', utils.miniMarkdown('_foo__'));
        assert.equal('<a href="/login">User Login</a>', utils.miniMarkdown('[User Login](/login)'));
    }
};