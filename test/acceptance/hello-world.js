const app = require('../../examples/hello-world/')
const request = require('supertest')

describe('hello-world', () => {
  describe('GET /', () => {
    it('should respond with hello world', (done) => {
      request(app)
        .get('/')
        .expect(200, 'Hello World', done)
    })
  })

  describe('GET /missing', () => {
    it('should respond with 404', (done) => {
      request(app)
        .get('/missing')
        .expect(404, done)
    })
  })
})
