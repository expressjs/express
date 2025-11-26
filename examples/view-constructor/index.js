'use strict'

/**
 * Module dependencies.
 */

const express = require('../../')
const GithubView = require('./github-view')
const md = require('marked').parse

const app = module.exports = express()

// register .md as an engine in express view system
app.engine('md', (str, options, fn) => {
  try {
    let html = md(str)
    html = html.replace(/\{([^}]+)\}/g, (_, name) => options[name] || '')
    fn(null, html)
  } catch (err) {
    fn(err)
  }
})

// pointing to a particular github repo to load files from it
app.set('views', 'expressjs/express')

// register a new view constructor
app.set('view', GithubView)

app.get('/', (req, res) => {
  // rendering a view relative to the repo.
  // app.locals, res.locals, and locals passed
  // work like they normally would
  res.render('examples/markdown/views/index.md', { title: 'Example' })
})

app.get('/Readme.md', (req, res) => {
  // rendering a view from https://github.com/expressjs/express/blob/master/Readme.md
  res.render('Readme.md')
})

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000)
  console.log('Express started on port 3000')
}
