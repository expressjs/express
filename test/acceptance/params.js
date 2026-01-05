const app = require('../../examples/params/')
const request = require('supertest')

describe('params', () => {
  describe('GET /', () => {
    it('should respond with instructions', (done) => {
      request(app)
        .get('/')
        .expect(/Visit/, done)
    })
  })

  describe('GET /user/0', () => {
    it('should respond with a user', (done) => {
      request(app)
        .get('/user/0')
        .expect(/user tj/, done)
    })
  })

  describe('GET /user/9', () => {
    it('should fail to find user', (done) => {
      request(app)
        .get('/user/9')
        .expect(404, /failed to find user/, done)
    })
  })

  describe('GET /users/0-2', () => {
    it('should respond with three users', (done) => {
      request(app)
        .get('/users/0-2')
        .expect(/users tj, tobi, loki/, done)
    })
  })

  describe('GET /users/foo-bar', () => {
    it('should fail integer parsing', (done) => {
      request(app)
        .get('/users/foo-bar')
        .expect(400, /failed to parseInt foo/, done)
    })
  })
})
