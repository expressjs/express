'use strict'

const users = require('./db')

exports.html = function (req, res) {
  res.send('<ul>' + users.map((user) => '<li>' + user.name + '</li>').join('') + '</ul>')
}

exports.text = function (req, res) {
  res.send(users.map((user) => ' - ' + user.name + '\n').join(''))
}

exports.json = function (req, res) {
  res.json(users)
}
