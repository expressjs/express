const app = require('../../examples/markdown/')
const request = require('supertest')

describe('markdown', () => {
  describe('GET /', () => {
    it('should respond with html', (done) => {
      request(app)
        .get('/')
        .expect(/<h1[^>]*>Markdown Example<\/h1>/, done)
    })
  })

  describe('GET /fail', () => {
    it('should respond with an error', (done) => {
      request(app)
        .get('/fail')
        .expect(500, done)
    })
  })
})
