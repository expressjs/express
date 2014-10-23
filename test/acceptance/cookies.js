
var app = require('../../examples/cookies')
  , request = require('supertest');

describe('cookies', function(){
  describe('GET /', function(){
    it('should have a form', function(done){
      request(app)
      .get('/')
      .expect(/<form/, done);
    })

    it('should respond with no cookies', function(done){
      request(app)
      .get('/')
      .end(function(err, res){
        res.headers.should.not.have.property('set-cookie')
        done()
      })
    })

    it('should respond to cookie', function(done){
      request(app)
      .post('/')
      .type('urlencoded')
      .send({ remember: 1 })
      .expect(302, function(err, res){
        if (err) return done(err)
        request(app)
        .get('/')
        .set('Cookie', res.headers['set-cookie'][0])
        .expect(200, /Remembered/, done)
      })
    })
  })

  describe('GET /forget', function(){
    it('should clear cookie', function(done){
      request(app)
      .post('/')
      .type('urlencoded')
      .send({ remember: 1 })
      .expect(302, function(err, res){
        if (err) return done(err)
        request(app)
        .get('/forget')
        .set('Cookie', res.headers['set-cookie'][0])
        .expect('Set-Cookie', /remember=;/)
        .expect(302, done)
      })
    })
  })

  describe('POST /', function(){
    it('should set a cookie', function(done){
      request(app)
      .post('/')
      .type('urlencoded')
      .send({ remember: 1 })
      .expect(302, function(err, res){
        res.headers.should.have.property('set-cookie')
        done()
      })
    })

    it('should no set cookie w/o reminder', function(done){
      request(app)
      .post('/')
      .send({})
      .expect(302, function(err, res){
        res.headers.should.not.have.property('set-cookie')
        done()
      })
    })
  })
})
