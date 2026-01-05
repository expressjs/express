const app = require('../../examples/error-pages/')
const request = require('supertest')

describe('error-pages', () => {
  describe('GET /', () => {
    it('should respond with page list', (done) => {
      request(app)
        .get('/')
        .expect(/Pages Example/, done)
    })
  })

  describe('Accept: text/html', () => {
    describe('GET /403', () => {
      it('should respond with 403', (done) => {
        request(app)
          .get('/403')
          .expect(403, done)
      })
    })

    describe('GET /404', () => {
      it('should respond with 404', (done) => {
        request(app)
          .get('/404')
          .expect(404, done)
      })
    })

    describe('GET /500', () => {
      it('should respond with 500', (done) => {
        request(app)
          .get('/500')
          .expect(500, done)
      })
    })
  })

  describe('Accept: application/json', () => {
    describe('GET /403', () => {
      it('should respond with 403', (done) => {
        request(app)
          .get('/403')
          .set('Accept', 'application/json')
          .expect(403, done)
      })
    })

    describe('GET /404', () => {
      it('should respond with 404', (done) => {
        request(app)
          .get('/404')
          .set('Accept', 'application/json')
          .expect(404, { error: 'Not found' }, done)
      })
    })

    describe('GET /500', () => {
      it('should respond with 500', (done) => {
        request(app)
          .get('/500')
          .set('Accept', 'application/json')
          .expect(500, done)
      })
    })
  })

  describe('Accept: text/plain', () => {
    describe('GET /403', () => {
      it('should respond with 403', (done) => {
        request(app)
          .get('/403')
          .set('Accept', 'text/plain')
          .expect(403, done)
      })
    })

    describe('GET /404', () => {
      it('should respond with 404', (done) => {
        request(app)
          .get('/404')
          .set('Accept', 'text/plain')
          .expect(404)
          .expect('Not found', done)
      })
    })

    describe('GET /500', () => {
      it('should respond with 500', (done) => {
        request(app)
          .get('/500')
          .set('Accept', 'text/plain')
          .expect(500, done)
      })
    })
  })
})
