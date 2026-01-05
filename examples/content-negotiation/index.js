'use strict'

const express = require('../../')
const app = module.exports = express()
const users = require('./db')

// so either you can deal with different types of formatting
// for expected response in index.js
app.get('/', (req, res) => {
  res.format({
    html: function () {
      res.send('<ul>' + users.map((user) => '<li>' + user.name + '</li>').join('') + '</ul>')
    },

    text: function () {
      res.send(users.map((user) => ' - ' + user.name + '\n').join(''))
    },

    json: function () {
      res.json(users)
    }
  })
})

// or you could write a tiny middleware like
// this to add a layer of abstraction
// and make things a bit more declarative:

function format (path) {
  // eslint-disable-next-line global-require
  const obj = require(path)
  return function (req, res) {
    res.format(obj)
  }
}

app.get('/users', format('./users'))

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000)
  console.log('Express started on port 3000')
}
