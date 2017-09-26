'use strict'

/**
 * Module dependencies.
 */

const express = require('../..')
const logger = require('morgan')
const session = require('express-session')

// pass the express to the connect redis module
// allowing it to inherit from session.Store
const RedisStore = require('connect-redis')(session)

const app = express()

app.use(logger('dev'));

// Populates req.session
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'keyboard cat',
  store: new RedisStore
}));

app.get('/', function(req, res){
  let body = ''
  if (req.session.views) {
    ++req.session.views;
  } else {
    req.session.views = 1;
    body += '<p>First time visiting? view this page in several browsers :)</p>';
  }
  res.send(body + '<p>viewed <strong>' + req.session.views + '</strong> times.</p>');
});

app.listen(3000);
console.log('Express app started on port 3000');
