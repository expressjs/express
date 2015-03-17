
var app = require('../../examples/cookie-sessions')
var request = require('supertest')

function getCookie(res) {
  return res.headers['set-cookie'][0].split(';')[0]
}

describe('cookie-sessions', function () {
  describe('GET /', function () {
    it('should display no views', function (done) {
      request(app)
      .get('/')
      .expect(200, 'viewed 0 times\n', done)
    })

    it('should set a session cookie', function (done) {
      request(app)
      .get('/')
      .expect('Set-Cookie', /connect\.sess=/)
      .expect(200, done)
    })

    it('should display 1 view on revisit', function (done) {
      request(app)
      .get('/')
      .expect(200, 'viewed 0 times\n', function (err, res) {
        if (err) return done(err)
        request(app)
        .get('/')
        .set('Cookie', getCookie(res))
        .expect(200, 'viewed 1 times\n', done)
      })
    })
  })
})
