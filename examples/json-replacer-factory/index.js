'use strict'

var express = require('../../')
var app = module.exports = express()

app.set('json replacer factory', function (req, res) {
  return function (key, value) {
    if (key === 'sources' && req.query.sources === 'omit') return undefined
    if (typeof value === 'bigint') return value.toString()
    if (value instanceof Map) return Object.fromEntries(value)
    return key === 'message' && res.locals.language === 'fr' ? 'Bonjour' : value
  }
})

app.use(function (req, res, next) {
  res.locals.language = req.query.language
  next()
})

app.get('/', function (req, res) {
  res.json({ message: 'Hello' })
})

app.get('/jsonp', function (req, res) {
  res.jsonp({ message: 'Hello' })
})

// An illustrative response; no model or retrieval service is required.
app.get('/rag', function (req, res) {
  res.json({
    answer: 'The document describes response formatting.',
    documentId: 9007199254740993n,
    sources: new Map([['example-document', { score: 0.9 }]])
  })
})

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000)
  console.log('JSON replacer factory example listening on port 3000')
}
