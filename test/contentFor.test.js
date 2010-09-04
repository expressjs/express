
/**
 * Module dependencies.
 */

var contentForHelpers = require('express/helpers/contentFor');

var newContentForHelper = function(){
    return contentForHelpers(null, null);
};

module.exports = {
    "test exists('doesn't exist')": function(assert) {
        var helper = newContentForHelper();
        assert.eql(false, helper.exists('foo'));
    },

    "test exists('exists')": function(assert) {
        var helper = newContentForHelper();
        helper.set('foo', 'bar');
        assert.eql(true, helper.exists('foo'));
    },

    "test get('doesn't exist') returns ''": function(assert) {
        var helper = newContentForHelper();
        assert.eql('', helper.get('foo'));
    },

    "test get('exists')": function(assert) {
        var helper = newContentForHelper();
        helper.set('foo', 'bar');
        assert.eql('bar', helper.get('foo'));
    },

    "test fetch('doesn't exist', 'default')": function(assert) {
        var helper = newContentForHelper();
        assert.eql('default', helper.fetch('foo', 'default'));
        assert.eql('default', helper.get('foo'));
    },

    "test fetch('doesn't exist', default(){})": function(assert) {
        var helper = newContentForHelper();
        assert.eql('default', helper.fetch('foo', function() { return 'default'; }));
        assert.eql('default', helper.get('foo'));
    },

    "test fetch('exists')": function(assert) {
        var helper = newContentForHelper();
        helper.set('foo', 'bar');
        assert.eql('bar', helper.fetch('foo', 'baz'));
    },

    "test set('doesn't exist', 'value')": function(assert) {
        var helper = newContentForHelper();
        assert.eql(false, helper.exists('foo'));
        helper.set('foo', 'bar');
        assert.eql(true, helper.exists('foo'));
    },

    "test set('doesn't exist', value(){})": function(assert) {
        var helper = newContentForHelper();
        assert.eql(false, helper.exists('foo'));
        helper.set('foo', function() { return 'bar'; });
        assert.eql(true, helper.exists('foo'));
    },

    "test set('exists', 'value')": function(assert) {
        var helper = newContentForHelper();
        helper.set('foo', 'bar');
        helper.set('foo', 'baz');
        assert.eql('baz', helper.get('foo'));
    },

    "test set(...) returns ''": function(assert) {
        var helper = newContentForHelper();
        assert.eql('', helper.set('foo', 'bar'));
    },

    "test append('doesn't exist', 'value')": function(assert) {
        var helper = newContentForHelper();
        assert.eql(false, helper.exists('foo'));
        helper.append('foo', 'bar');
        assert.eql('bar', helper.get('foo'));
    },

    "test append('exists', 'value')": function(assert) {
        var helper = newContentForHelper();
        helper.set('foo', 'bar');
        helper.append('foo', 'baz');
        assert.eql('barbaz', helper.get('foo'));
    },

    "test append(...) returns ''": function(assert) {
        var helper = newContentForHelper();
        assert.eql('', helper.append('foo', 'bar'));
    },

    "test aliases": function(assert) {
        var helper = newContentForHelper();
        assert.eql(helper.exists,     helper.has);
        assert.eql(helper.fetch,      helper.yield);
        assert.eql(helper.set,        helper.put);
    }
}