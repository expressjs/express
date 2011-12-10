var app = require('../../examples/auth/app')
  , request = require('../support/http');

describe('auth', function(){
  var cookie;
  describe('GET /',function(){
    it('should redirect to /login', function(done){
      request(app)
        .get('/')
        .end(function(res){
          res.statusCode.should.equal(302);
          res.headers.should.have.property('location').match(/\/login$/);
          done();
        })
    })
  })
  describe('GET /restricted (w/o cookie)',function(){
    it('should redirect to /login', function(done){
      request(app)
        .get('/restricted')
        .end(function(res){
          res.statusCode.should.equal(302);
          res.headers.should.have.property('location').match(/\/login$/);
          done();
        })
    })
  })
  describe('POST /login', function(){
    it('should fail without proper credentials', function(done){
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
  })
  describe('GET /restricted (w. cookie)',function(){
    it('should respond with 200',function(done){
      request(app)
        .get('/restricted')
        .set('cookie',cookie)
        .expect(200,done)
    })
  })
  describe('GET /logout',function(){
    it('should respond with 302 and clear cookie',function(done){
      request(app)
        .get('/logout')
        .set('cookie',cookie)
        .end(function(res){
          res.statusCode.should.equal(302);
          res.headers.should.not.have.property('set-cookie')
          done();
        })
    })
  })
  describe('GET /restricted (w. expired cookie)',function(){
    it('should respond with 302',function(done){
      request(app)
        .get('/restricted')
        .set('cookie',cookie)
        .expect(302,done)
    })
  })
})