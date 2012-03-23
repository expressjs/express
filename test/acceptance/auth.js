var app = require('../../examples/auth/app')
  , request = require('../support/http');

function redirects(to,fn){
  return function(res){
    res.statusCode.should.equal(302)
    res.headers.should.have.property('location').match(to);
    fn()
  }
}

function getCookie(res) {
  return res.headers['set-cookie'][0].split(';')[0];
}

describe('auth', function(){
  var cookie;

  describe('GET /',function(){
    it('should redirect to /login', function(done){
      request(app)
        .get('/')
        .end(redirects(/\/login$/,done))
    })
  })

  describe('GET /restricted (w/o cookie)',function(){
    it('should redirect to /login', function(done){
      request(app)
        .get('/restricted')
        .end(redirects(/\/login$/,done))
    })
  })

  describe('POST /login', function(){
    it('should fail without proper credentials', function(done){
      request(app)
        .post('/login')
        .set('content-type','application/x-www-form-urlencoded')
        .write('&username=not-tj&password=foobar')
        .end(redirects(/\/login$/,done))
    })

    it('should authenticate', function(done){
      request(app)
        .post('/login')
        .set('content-type', 'application/x-www-form-urlencoded')
        .write('username=tj&password=foobar')
        .end(function(res){
          res.statusCode.should.equal(302);
          cookie = getCookie(res);
          request(app)
            .get('/login')
            .set('Cookie', cookie)
            .end(function(res){
              res.body.should.include('Authenticated as tj');
              done();
            })
        })
    })
  })

  describe('GET /restricted (w. cookie)',function(){
    it('should respond with 200', function(done){
      request(app)
        .get('/restricted')
        .set('Cookie', cookie)
        .expect(200, done);
    })
  })

  describe('GET /logout',function(){
    it('should respond with 302 and clear cookie',function(done){
      request(app)
        .get('/logout')
        .set('Cookie', cookie)
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
        .set('Cookie', cookie)
        .expect(302, done)
    })
  })
})