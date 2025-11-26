'use strict'

// install redis first:
// https://redis.io/

// then:
// $ npm install redis online
// $ redis-server

/**
 * Module dependencies.
 */

const express = require('../../')
let online = require('online')
const redis = require('redis')
const db = redis.createClient()

// online

online = online(db)

// app

const app = express()

// activity tracking, in this case using
// the UA string, you would use req.user.id etc

app.use((req, res, next) => {
  // fire-and-forget
  online.add(req.headers['user-agent'])
  next()
})

/**
 * List helper.
 */

function list (ids) {
  return '<ul>' + ids.map((id) => '<li>' + id + '</li>').join('') + '</ul>'
}

/**
 * GET users online.
 */

app.get('/', (req, res, next) => {
  online.last(5, (err, ids) => {
    if (err) return next(err)
    res.send('<p>Users online: ' + ids.length + '</p>' + list(ids))
  })
})

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000)
  console.log('Express started on port 3000')
}
