const request = require('supertest')
const app = require('../../examples/mvc/')

describe('mvc', () => {
  describe('GET /', () => {
    it('should redirect to /users', (done) => {
      request(app)
        .get('/')
        .expect('Location', '/users')
        .expect(302, done)
    })
  })

  describe('GET /pet/0', () => {
    it('should get pet', (done) => {
      request(app)
        .get('/pet/0')
        .expect(200, /Tobi/, done)
    })
  })

  describe('GET /pet/0/edit', () => {
    it('should get pet edit page', (done) => {
      request(app)
        .get('/pet/0/edit')
        .expect(/<form/)
        .expect(200, /Tobi/, done)
    })
  })

  describe('PUT /pet/2', () => {
    it('should update the pet', (done) => {
      request(app)
        .put('/pet/3')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ pet: { name: 'Boots' } })
        .expect(302, (err, res) => {
          if (err) return done(err)
          request(app)
            .get('/pet/3/edit')
            .expect(200, /Boots/, done)
        })
    })
  })

  describe('GET /users', () => {
    it('should display a list of users', (done) => {
      request(app)
        .get('/users')
        .expect(/<h1>Users<\/h1>/)
        .expect(/>TJ</)
        .expect(/>Guillermo</)
        .expect(/>Nathan</)
        .expect(200, done)
    })
  })

  describe('GET /user/:id', () => {
    describe('when present', () => {
      it('should display the user', (done) => {
        request(app)
          .get('/user/0')
          .expect(200, /<h1>TJ <a href="\/user\/0\/edit">edit/, done)
      })

      it('should display the users pets', (done) => {
        request(app)
          .get('/user/0')
          .expect(/\/pet\/0">Tobi/)
          .expect(/\/pet\/1">Loki/)
          .expect(/\/pet\/2">Jane/)
          .expect(200, done)
      })
    })

    describe('when not present', () => {
      it('should 404', (done) => {
        request(app)
          .get('/user/123')
          .expect(404, done)
      })
    })
  })

  describe('GET /user/:id/edit', () => {
    it('should display the edit form', (done) => {
      request(app)
        .get('/user/1/edit')
        .expect(/Guillermo/)
        .expect(200, /<form/, done)
    })
  })

  describe('PUT /user/:id', () => {
    it('should 500 on error', (done) => {
      request(app)
        .put('/user/1')
        .send({})
        .expect(500, done)
    })

    it('should update the user', (done) => {
      request(app)
        .put('/user/1')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ user: { name: 'Tobo' } })
        .expect(302, (err, res) => {
          if (err) return done(err)
          request(app)
            .get('/user/1/edit')
            .expect(200, /Tobo/, done)
        })
    })
  })

  describe('POST /user/:id/pet', () => {
    it('should create a pet for user', (done) => {
      request(app)
        .post('/user/2/pet')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ pet: { name: 'Snickers' } })
        .expect('Location', '/user/2')
        .expect(302, (err, res) => {
          if (err) return done(err)
          request(app)
            .get('/user/2')
            .expect(200, /Snickers/, done)
        })
    })
  })
})
