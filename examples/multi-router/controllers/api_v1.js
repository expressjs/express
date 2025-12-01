'use strict'

const express = require('../../../')

const apiv1 = express.Router()

apiv1.get('/', (req, res) => {
  res.send('Hello from APIv1 root route.')
})

apiv1.get('/users', (req, res) => {
  res.send('List of APIv1 users.')
})

module.exports = apiv1
