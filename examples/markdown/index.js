'use strict'

/**
 * Module dependencies.
 */

const escapeHtml = require('escape-html')
const express = require('../../')
const fs = require('node:fs')
const marked = require('marked')
const path = require('node:path')

const app = module.exports = express()

// register .md as an engine in express view system

app.engine('md', (path, options, fn) => {
  fs.readFile(path, 'utf8', (err, str) => {
    if (err) return fn(err)
    const html = marked.parse(str).replace(/\{([^}]+)\}/g, (_, name) => escapeHtml(options[name] || ''))
    fn(null, html)
  })
})

app.set('views', path.join(__dirname, 'views'))

// make it the default, so we don't need .md
app.set('view engine', 'md')

app.get('/', (req, res) => {
  res.render('index', { title: 'Markdown Example' })
})

app.get('/fail', (req, res) => {
  res.render('missing', { title: 'Markdown Example' })
})

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000)
  console.log('Express started on port 3000')
}
