const app = require('../../examples/auth/')
const request = require('supertest')

function getCookie (res) {
  return res.headers['set-cookie'][0].split(';')[0]
}

describe('auth', () => {
  describe('GET /', () => {
    it('should redirect to /login', (done) => {
      request(app)
        .get('/')
        .expect('Location', '/login')
        .expect(302, done)
    })
  })

  describe('GET /login', () => {
    it('should render login form', (done) => {
      request(app)
        .get('/login')
        .expect(200, /<form/, done)
    })

    it('should display login error for bad user', (done) => {
      request(app)
        .post('/login')
        .type('urlencoded')
        .send('username=not-tj&password=foobar')
        .expect('Location', '/login')
        .expect(302, (err, res) => {
          if (err) return done(err)
          request(app)
            .get('/login')
            .set('Cookie', getCookie(res))
            .expect(200, /Authentication failed/, done)
        })
    })

    it('should display login error for bad password', (done) => {
      request(app)
        .post('/login')
        .type('urlencoded')
        .send('username=tj&password=nogood')
        .expect('Location', '/login')
        .expect(302, (err, res) => {
          if (err) return done(err)
          request(app)
            .get('/login')
            .set('Cookie', getCookie(res))
            .expect(200, /Authentication failed/, done)
        })
    })
  })

  describe('GET /logout', () => {
    it('should redirect to /', (done) => {
      request(app)
        .get('/logout')
        .expect('Location', '/')
        .expect(302, done)
    })
  })

  describe('GET /restricted', () => {
    it('should redirect to /login without cookie', (done) => {
      request(app)
        .get('/restricted')
        .expect('Location', '/login')
        .expect(302, done)
    })

    it('should succeed with proper cookie', (done) => {
      request(app)
        .post('/login')
        .type('urlencoded')
        .send('username=tj&password=foobar')
        .expect('Location', '/')
        .expect(302, (err, res) => {
          if (err) return done(err)
          request(app)
            .get('/restricted')
            .set('Cookie', getCookie(res))
            .expect(200, done)
        })
    })
  })

  describe('POST /login', () => {
    it('should fail without proper username', (done) => {
      request(app)
        .post('/login')
        .type('urlencoded')
        .send('username=not-tj&password=foobar')
        .expect('Location', '/login')
        .expect(302, done)
    })

    it('should fail without proper password', (done) => {
      request(app)
        .post('/login')
        .type('urlencoded')
        .send('username=tj&password=baz')
        .expect('Location', '/login')
        .expect(302, done)
    })

    it('should succeed with proper credentials', (done) => {
      request(app)
        .post('/login')
        .type('urlencoded')
        .send('username=tj&password=foobar')
        .expect('Location', '/')
        .expect(302, done)
    })
  })
})
