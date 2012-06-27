var app = require('../../examples/auth/app')
  , request = require('../support/http');

function redirects(to, fn){
  return function(err, res){
    res.statusCode.should.equal(302)
    res.headers.should.have.property('location').match(to);
    fn()
  }
}

function getCookie(res) {
  return res.headers['set-cookie'][0].split(';')[0];
}

describe('auth', function(){
  describe('GET /',function(){
    it('should redirect to /login', function(done){
      request(app)
      .get('/')
      .end(redirects(/\/login$/, done))
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
      .type('urlencoded')
      .send('username=not-tj&password=foobar')
      .end(redirects(/\/login$/, done))
    })
  })
})