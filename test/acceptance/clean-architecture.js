var app = require('../../examples/clean-architecture')
var request = require('supertest')



describe.only('clean-architecture-crud', function () {

  describe('GET /', function () {
    it('should return empty array', function (done) {
      request(app)
        .get('/notes')
        .expect(200, [], done)
    })

    it('list after creation', function (done) {
      request(app)
        .post('/notes')
        .set('Content-Type', 'application/json')
        .send('{"title": "Text"}')
        .expect(201, (err, _res) => {
          if (err) return done(err)
          request(app)
            .get('/notes')
            .expect(200, (err, res) => {
              if (err) return done(err)
              if (res.body.length === 1 && res.body[0].title === 'Text') {
                done()
              }
            })
        })
    })

  })


  describe('GET /:id', function () {
    it('get after creation', function (done) {
      request(app)
        .post('/notes')
        .set('Content-Type', 'application/json')
        .send('{"title": "Text"}')
        .expect(201, (err, res) => {
          if (err) return done(err)
          request(app)
            .get(`/notes/${res.body.id}`)
            .expect(200, (err, res) => {
              if (err) return done(err)
              if (res.body.title === 'Text') {
                done()
              }
            })
        })
    })

  })

  describe('POST /', function () {
    it('validation error on title', function (done) {
      request(app)
        .post('/notes')
        .set('Content-Type', 'application/json')
        .send('{"title": ""}')
        .expect(400, `"field 'title' should not be empty"`, done)
    })

    it('creation ok', function (done) {
      request(app)
        .post('/notes')
        .set('Content-Type', 'application/json')
        .send('{"title": "Text"}')
        .expect(201, done)
    })
  })

  describe('POST /', function () {
    it('validation error on title', function (done) {
      request(app)
        .post('/notes')
        .set('Content-Type', 'application/json')
        .send('{"title": ""}')
        .expect(400, `"field 'title' should not be empty"`, done)
    })
  })

  describe('DELETE /', function () {
    it('delete after creation', function (done) {
      request(app)
        .post('/notes')
        .set('Content-Type', 'application/json')
        .send('{"title": "Text"}')
        .expect(201, (err, res) => {
          if (err) return done(err)
          request(app)
            .delete(`/notes/${res.body.id}`)
            .expect(200, done)
        })
    })

  })

  describe('PATCH /', function () {
    it('update after creation', function (done) {
      request(app)
        .post('/notes')
        .set('Content-Type', 'application/json')
        .send('{"title": "Text"}')
        .expect(201, (err, res) => {
          if (err) return done(err)
          request(app)
            .patch(`/notes/${res.body.id}`)
            .send({title:"Test2"})
            .expect(200, '"Note updated"', done)
        })
    })

    it('error in update after creation', function (done) {
      request(app)
        .post('/notes')
        .set('Content-Type', 'application/json')
        .send('{"title": "Text"}')
        .expect(201, (err, res) => {
          if (err) return done(err)
          request(app)
            .patch(`/notes/${res.body.id}`)
            .send({title:""})
            .expect(400, done)
        })
    })

  })

})
