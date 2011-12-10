var app = require('../../examples/auth/app')
  , request = require('../support/http')
  , should = require('should');

describe('examples', function(){
  describe('auth', function(){
    var cookie;
    it('should redirect to /login', function(done){
      request(app)
        .get('/')
        .end(function(res){
          res.statusCode.should.equal(302);
          res.headers.should.have.property('location').match(/\/login$/);
          done();
        })
    })
    it('should be restricted', function(done){
      request(app)
        .get('/restricted')
        .end(function(res){
          res.statusCode.should.equal(302);
          res.headers.should.have.property('location').match(/\/login$/);
          done();
        })
    })
    it('should fail to authenticate', function(done){
      request(app)
        .post('/login')
        .write('&username=not-tj&password=foobar')
        .end(function(res){
          res.statusCode.should.equal(302);
          res.headers.should.have.property('location').match(/\/login$/);
          done();
        })
    })
    it('should authenticate', function(done){
      request(app)
        .post('/login')
        .set('content-type','application/x-www-form-urlencoded')
        .write('&username=tj&password=foobar')
        .end(function(res){
          res.statusCode.should.equal(302);
          res.headers.should.have.property('location').match(/\/restricted$/);
          cookie = res.headers['set-cookie'][0].split(';')[0];
          cookie.should.match(/^connect.sid=/)
          done();
        })
    })
    it('should not be restricted with an authenticated session cookie',function(done){
      request(app)
        .get('/restricted')
        .set('cookie',cookie)
        .expect(200,done)
    })
    it('should logout',function(done){
      request(app)
        .get('/logout')
        .set('cookie',cookie)
        .end(function(res){
          res.statusCode.should.equal(302);
          res.headers.should.not.have.property('set-cookie')
          done();
        })
    })
    it('should be restricted again',function(done){
      request(app)
        .get('/restricted')
        .set('cookie',cookie)
        .expect(302,done)
    })
  })
})