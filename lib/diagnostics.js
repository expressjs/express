'use strict';

const dc = require('node:diagnostics_channel');

const initialization = dc.channel('express.initialization');

module.exports = { initialization };
