
var request = require('../support/http')
  , app = require('../../examples/mvc');

describe('mvc', function(){
  describe('GET /', function(){
    it('should redirect to /users', function(done){
      request(app)
      .get('/')
      .end(function(res){
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
      .end(function(res){
        res.body.should.include('<h1>Users</h1>');
        res.body.should.include('>TJ<');
        res.body.should.include('>Guillermo<');
        res.body.should.include('>Nathan<');
        done();
      })
    })
  })

  describe('GET /user/:id', function(){
    describe('when present', function(){
      it('should display the user', function(done){
        request(app)
        .get('/user/0')
        .end(function(res){
          res.body.should.include('<h1>TJ <a href="/user/0/edit">edit');
          done();
        })
      })

      it('should display the users pets', function(done){
        request(app)
        .get('/user/0')
        .end(function(res){
          res.body.should.include('/pet/0">Tobi');
          res.body.should.include('/pet/1">Loki');
          res.body.should.include('/pet/2">Jane');
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
})