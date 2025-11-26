const app = require('../../examples/error/')
const request = require('supertest')

describe('error', () => {
  describe('GET /', () => {
    it('should respond with 500', (done) => {
      request(app)
        .get('/')
        .expect(500, done)
    })
  })

  describe('GET /next', () => {
    it('should respond with 500', (done) => {
      request(app)
        .get('/next')
        .expect(500, done)
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
