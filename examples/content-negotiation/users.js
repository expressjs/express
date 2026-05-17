/* In examples/content-negotiation/app.js (or the main Express setup file) */
const express = require('express');
const app = express();
const users = require('./users');

app.get('/users', (req, res, next) => {
  const accept = req.headers.accept || '';
  if (accept.includes('text/html')) return users.html(req, res);
  if (accept.includes('application/json')) return users.json(req, res);
  return users.text(req, res);
});

module.exports = app;