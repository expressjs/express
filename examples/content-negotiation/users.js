/* In the appropriate router file, e.g., routes/users.js */
const express = require('express');
const router = express.Router();
const usersHandlers = require('../examples/content-negotiation/users');

router.get('/users', (req, res, next) => {
  const accept = req.headers.accept || '';
  if (accept.includes('text/html')) return usersHandlers.html(req, res);
  if (accept.includes('application/json')) return usersHandlers.json(req, res);
  return usersHandlers.text(req, res);
});

module.exports = router;