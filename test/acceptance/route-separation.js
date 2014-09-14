
var app = require('../../examples/route-separation')
var request = require('supertest')

describe('route-separation', function () {
  describe('GET /', function () {
    it('should respond with index', function (done) {
      request(app)
      .get('/')
      .expect(200, /Route Separation Example/, done)
    })
  })

  describe('GET /users', function () {
    it('should list users', function (done) {
      request(app)
      .get('/users')
      .expect(/TJ/)
      .expect(/Tobi/)
      .expect(200, done)
    })
  })

  describe('GET /user/:id', function () {
    it('should get a user', function (done) {
      request(app)
      .get('/user/0')
      .expect(200, /Viewing user TJ/, done)
    })

    it('should 404 on missing user', function (done) {
      request(app)
      .get('/user/10')
      .expect(404, done)
    })
  })

  describe('GET /user/:id/view', function () {
    it('should get a user', function (done) {
      request(app)
      .get('/user/0/view')
      .expect(200, /Viewing user TJ/, done)
    })

    it('should 404 on missing user', function (done) {
      request(app)
      .get('/user/10/view')
      .expect(404, done)
    })
  })

  describe('GET /user/:id/edit', function () {
    it('should get a user to edit', function (done) {
      request(app)
      .get('/user/0/edit')
      .expect(200, /Editing user TJ/, done)
    })
  })

  describe('PUT /user/:id/edit', function () {
    it('should edit a user', function (done) {
      request(app)
      .put('/user/0/edit')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ user: { name: 'TJ', email: 'tj-invalid@vision-media.ca' } })
      .expect(302, function (err) {
        if (err) return done(err)
        request(app)
        .get('/user/0')
        .expect(200, /tj-invalid@vision-media\.ca/, done)
      })
    })
  })

  describe('POST /user/:id/edit?_method=PUT', function () {
    it('should edit a user', function (done) {
      request(app)
      .post('/user/1/edit?_method=PUT')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ user: { name: 'Tobi', email: 'tobi-invalid@vision-media.ca' } })
      .expect(302, function (err) {
        if (err) return done(err)
        request(app)
        .get('/user/1')
        .expect(200, /tobi-invalid@vision-media\.ca/, done)
      })
    })
  })

  describe('GET /posts', function () {
    it('should get a list of posts', function (done) {
      request(app)
      .get('/posts')
      .expect(200, /Posts/, done)
    })
  })
})
