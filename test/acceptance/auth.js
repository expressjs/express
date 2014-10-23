var app = require('../../examples/auth')
var request = require('supertest')

function getCookie(res) {
  return res.headers['set-cookie'][0].split(';')[0];
}

describe('auth', function(){
  describe('GET /',function(){
    it('should redirect to /login', function(done){
      request(app)
      .get('/')
      .expect('Location', '/login')
      .expect(302, done)
    })
  })

  describe('GET /login',function(){
    it('should render login form', function(done){
      request(app)
      .get('/login')
      .expect(200, /<form/, done)
    })

    it('should display login error', function(done){
      request(app)
      .post('/login')
      .type('urlencoded')
      .send('username=not-tj&password=foobar')
      .expect('Location', '/login')
      .expect(302, function(err, res){
        if (err) return done(err)
        request(app)
        .get('/login')
        .set('Cookie', getCookie(res))
        .expect(200, /Authentication failed/, done)
      })
    })
  })

  describe('GET /logout',function(){
    it('should redirect to /', function(done){
      request(app)
      .get('/logout')
      .expect('Location', '/')
      .expect(302, done)
    })
  })

  describe('GET /restricted',function(){
    it('should redirect to /login without cookie', function(done){
      request(app)
      .get('/restricted')
      .expect('Location', '/login')
      .expect(302, done)
    })

    it('should succeed with proper cookie', function(done){
      request(app)
      .post('/login')
      .type('urlencoded')
      .send('username=tj&password=foobar')
      .expect('Location', '/')
      .expect(302, function(err, res){
        if (err) return done(err)
        request(app)
        .get('/restricted')
        .set('Cookie', getCookie(res))
        .expect(200, done)
      })
    })
  })

  describe('POST /login', function(){
    it('should fail without proper username', function(done){
      request(app)
      .post('/login')
      .type('urlencoded')
      .send('username=not-tj&password=foobar')
      .expect('Location', '/login')
      .expect(302, done)
    })

    it('should fail without proper password', function(done){
      request(app)
      .post('/login')
      .type('urlencoded')
      .send('username=tj&password=baz')
      .expect('Location', '/login')
      .expect(302, done)
    })

    it('should succeed with proper credentials', function(done){
      request(app)
      .post('/login')
      .type('urlencoded')
      .send('username=tj&password=foobar')
      .expect('Location', '/')
      .expect(302, done)
    })
  })
})
