'use strict'

var request = require('supertest')
var app = require('../../examples/json-replacer-factory')

describe('json-replacer-factory example', function () {
  it('uses response locals for localized messages', function () {
    return request(app).get('/?language=fr').expect(200, { message: 'Bonjour' })
  })

  it('normalizes large IDs and Map values in one shared formatter', function () {
    return request(app).get('/rag').expect(200, {
      answer: 'The document describes response formatting.',
      documentId: '9007199254740993',
      sources: { 'example-document': { score: 0.9 } }
    })
  })

  it('uses request context without affecting the next response', function () {
    return request(app).get('/rag?sources=omit').expect(200, {
      answer: 'The document describes response formatting.',
      documentId: '9007199254740993'
    }).then(function () {
      return request(app).get('/rag').expect(function (res) {
        if (!res.body.sources) throw new Error('sources leaked out of the next response')
      }).expect(200)
    })
  })
})
