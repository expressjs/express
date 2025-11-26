'use strict'

/**
 * Module dependencies.
 */

const express = require('../../')
const path = require('node:path')
const app = express()
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const site = require('./site')
const post = require('./post')
const user = require('./user')

module.exports = app

// Config

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

/* istanbul ignore next */
if (!module.parent) {
  app.use(logger('dev'))
}

app.use(methodOverride('_method'))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// General

app.get('/', site.index)

// User

app.get('/users', user.list)
app.all('/user/:id{/:op}', user.load)
app.get('/user/:id', user.view)
app.get('/user/:id/view', user.view)
app.get('/user/:id/edit', user.edit)
app.put('/user/:id/edit', user.update)

// Posts

app.get('/posts', post.list)

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000)
  console.log('Express started on port 3000')
}
