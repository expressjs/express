
var request = require('../support/http')
  , app = require('../../examples/mvc');

describe('mvc', function(){
  describe('GET /', function(){
    it('should redirect to /users', function(done){
      request(app)
      .get('/')
      .end(function(err, res){
        res.should.have.status(302);
        res.headers.location.should.include('/users');
        done();
      })
    })
  })

  describe('GET /users', function(){
    it('should display a list of users', function(done){
      request(app)
      .get('/users')
      .end(function(err, res){
        res.text.should.include('<h1>Users</h1>');
        res.text.should.include('>TJ<');
        res.text.should.include('>Guillermo<');
        res.text.should.include('>Nathan<');
        done();
      })
    })
  })

  describe('GET /user/:id', function(){
    describe('when present', function(){
      it('should display the user', function(done){
        request(app)
        .get('/user/0')
        .end(function(err, res){
          res.text.should.include('<h1>TJ <a href="/user/0/edit">edit');
          done();
        })
      })

      it('should display the users pets', function(done){
        request(app)
        .get('/user/0')
        .end(function(err, res){
          res.text.should.include('/pet/0">Tobi');
          res.text.should.include('/pet/1">Loki');
          res.text.should.include('/pet/2">Jane');
          done();
        })
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
      .end(function(err, res){
        res.text.should.include('<h1>Guillermo</h1>');
        res.text.should.include('value="put"');
        done();
      })
    })
  })

  describe('PUT /user/:id', function(){
    it('should update the user', function(done){
      request(app)
      .put('/user/1')
      .send({ user: { name: 'Tobo' }})
      .end(function(err, res){
        request(app)
        .get('/user/1/edit')
        .end(function(err, res){
          res.text.should.include('<h1>Tobo</h1>');
          done();
        })
      })
    })
  })
})