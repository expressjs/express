const app = require('../../examples/cookie-sessions/')
const request = require('supertest')

describe('cookie-sessions', () => {
  describe('GET /', () => {
    it('should display no views', (done) => {
      request(app)
        .get('/')
        .expect(200, 'viewed 1 times\n', done)
    })

    it('should set a session cookie', (done) => {
      request(app)
        .get('/')
        .expect('Set-Cookie', /session=/)
        .expect(200, done)
    })

    it('should display 1 view on revisit', (done) => {
      request(app)
        .get('/')
        .expect(200, 'viewed 1 times\n', (err, res) => {
          if (err) return done(err)
          request(app)
            .get('/')
            .set('Cookie', getCookies(res))
            .expect(200, 'viewed 2 times\n', done)
        })
    })
  })
})

function getCookies (res) {
  return res.headers['set-cookie'].map((val) => val.split(';')[0]).join('; ')
}
