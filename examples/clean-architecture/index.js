'use strict'

/**
 * Module dependencies.
 */

/**
 * This example is a Clean Architecture implementation of a CRUD application.
 * You have only the Note entity and 4 rest api endpoints:
 * - GET /note
 * - GET /note/:id
 * - POST /note
 * - PATCH /note/:id
 * - DELETE /note/:id
 */

const express = require('../..');
const logger = require('morgan');
const loadRoutes = require('./routes');

const app = module.exports = express();

// log
if (!module.parent) app.use(logger('dev'));

// parse request bodies (req.body)
app.use(express.json());

loadRoutes(app)

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
