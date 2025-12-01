const request = require('supertest')
const app = require('../../examples/content-negotiation/')

describe('content-negotiation', () => {
  describe('GET /', () => {
    it('should default to text/html', (done) => {
      request(app)
        .get('/')
        .expect(200, '<ul><li>Tobi</li><li>Loki</li><li>Jane</li></ul>', done)
    })

    it('should accept to text/plain', (done) => {
      request(app)
        .get('/')
        .set('Accept', 'text/plain')
        .expect(200, ' - Tobi\n - Loki\n - Jane\n', done)
    })

    it('should accept to application/json', (done) => {
      request(app)
        .get('/')
        .set('Accept', 'application/json')
        .expect(200, '[{"name":"Tobi"},{"name":"Loki"},{"name":"Jane"}]', done)
    })
  })

  describe('GET /users', () => {
    it('should default to text/html', (done) => {
      request(app)
        .get('/users')
        .expect(200, '<ul><li>Tobi</li><li>Loki</li><li>Jane</li></ul>', done)
    })

    it('should accept to text/plain', (done) => {
      request(app)
        .get('/users')
        .set('Accept', 'text/plain')
        .expect(200, ' - Tobi\n - Loki\n - Jane\n', done)
    })

    it('should accept to application/json', (done) => {
      request(app)
        .get('/users')
        .set('Accept', 'application/json')
        .expect(200, '[{"name":"Tobi"},{"name":"Loki"},{"name":"Jane"}]', done)
    })
  })
})
