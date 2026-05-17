// In the route registration file (e.g., examples/content-negotiation/router.js or index.js)
const express = require('express');
const router = express.Router();
const usersController = require('./users'); // <-- added import

router.get('/users.html', usersController.html);
router.get('/users.txt', usersController.text);
router.get('/users.json', usersController.json);

module.exports = router;