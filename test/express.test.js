
var express = require('express');

module.exports = {
    'test .version': function(assert){
        assert.ok(/^\d+\.\d+\.\d+$/.test(express.version), 'Test express.version format');
    }
};