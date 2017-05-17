
var pkg = require('../package.json');
var mdl = pkg.name === 'express' ? '..' : 'express';

module.exports = require(mdl);
