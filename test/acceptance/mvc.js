
var request = require('supertest')
  , app = require('../../examples/mvc');

describe('mvc', function(){
  describe('GET /', function(){
    it('should redirect to /users', function(done){
      request(app)
      .get('/')
      .expect('Location', '/users')
      .expect(302, done)
    })
  })

  describe('GET /pet/0', function(){
    it('should get pet', function(done){
      request(app)
      .get('/pet/0')
      .expect(200, /Tobi/, done)
    })
  })

  describe('GET /pet/0/edit', function(){
    it('should get pet edit page', function(done){
      request(app)
      .get('/pet/0/edit')
      .expect(/<form/)
      .expect(200, /Tobi/, done)
    })
  })

  describe('PUT /pet/2', function(){
    it('should update the pet', function(done){
      request(app)
      .put('/pet/3')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ pet: { name: 'Boots' } })
      .end(function(err, res){
        if (err) return done(err);
        request(app)
        .get('/pet/3/edit')
        .expect(200, /Boots/, done)
      })
    })
  })

  describe('GET /users', function(){
    it('should display a list of users', function(done){
      request(app)
      .get('/users')
      .expect(/<h1>Users<\/h1>/)
      .expect(/>TJ</)
      .expect(/>Guillermo</)
      .expect(/>Nathan</)
      .expect(200, done)
    })
  })

  describe('GET /user/:id', function(){
    describe('when present', function(){
      it('should display the user', function(done){
        request(app)
        .get('/user/0')
        .expect(200, /<h1>TJ <a href="\/user\/0\/edit">edit/, done)
      })

      it('should display the users pets', function(done){
        request(app)
        .get('/user/0')
        .expect(/\/pet\/0">Tobi/)
        .expect(/\/pet\/1">Loki/)
        .expect(/\/pet\/2">Jane/)
        .expect(200, done)
      })
    })

    describe('when not present', function(){
      it('should 404', function(done){
        request(app)
        .get('/user/123')
        .expect(404, done);
      })
    })
  })

  describe('GET /user/:id/edit', function(){
    it('should display the edit form', function(done){
      request(app)
      .get('/user/1/edit')
      .expect(/Guillermo/)
      .expect(200, /<form/, done)
    })
  })

  describe('PUT /user/:id', function(){
    it('should update the user', function(done){
      request(app)
      .put('/user/1')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ user: { name: 'Tobo' }})
      .end(function(err, res){
        if (err) return done(err);
        request(app)
        .get('/user/1/edit')
        .expect(200, /Tobo/, done)
      })
    })
  })

  describe('POST /user/:id/pet', function(){
    it('should create a pet for user', function(done){
      request(app)
      .post('/user/2/pet')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ pet: { name: 'Snickers' }})
      .expect('Location', '/user/2')
      .expect(302, function(err, res){
        if (err) return done(err)
        request(app)
        .get('/user/2')
        .expect(200, /Snickers/, done)
      })
    })
  })
})
