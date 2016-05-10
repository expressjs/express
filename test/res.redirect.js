
var http = require('http');
var express = require('..');
var request = require('supertest');
var utils = require('./support/utils');

describe('res', function(){
  describe('.redirect(url)', function(){
    it('should default to a 302 redirect', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .get('/')
      .expect('location', 'http://google.com')
      .expect(302, done)
    })
  })

  describe('.redirect(status, url)', function(){
    it('should set the response status', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect(303, 'http://google.com');
      });

      request(app)
      .get('/')
      .expect('Location', 'http://google.com')
      .expect(303, done)
    })
  })

  describe('.redirect(url, status)', function(){
    it('should set the response status', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com', 303);
      });

      request(app)
      .get('/')
      .expect('Location', 'http://google.com')
      .expect(303, done)
    })
  })

  describe('when the request method is HEAD', function(){
    it('should ignore the body', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .head('/')
      .expect('Location', 'http://google.com')
      .expect(302, '', done)
    })
  })

  describe('when accepting html', function(){
    it('should respond with html', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect('Location', 'http://google.com')
      .expect(302, '<p>' + http.STATUS_CODES[302] + '. Redirecting to <a href="http://google.com">http://google.com</a></p>', done);
    })

    it('should escape the url', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('<lame>');
      });

      request(app)
      .get('/')
      .set('Host', 'http://example.com')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect('Location', '<lame>')
      .expect(302, '<p>' + http.STATUS_CODES[302] + '. Redirecting to <a href="&lt;lame&gt;">&lt;lame&gt;</a></p>', done);
    })

    it('should include the redirect type', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect(301, 'http://google.com');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect('Location', 'http://google.com')
      .expect(301, '<p>Moved Permanently. Redirecting to <a href="http://google.com">http://google.com</a></p>', done);
    })
  })

  describe('when accepting text', function(){
    it('should respond with text', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/plain, */*')
      .expect('Content-Type', /plain/)
      .expect('Location', 'http://google.com')
      .expect(302, http.STATUS_CODES[302] + '. Redirecting to http://google.com', done);
    })

    it('should encode the url', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://example.com/?param=<script>alert("hax");</script>');
      });

      request(app)
      .get('/')
      .set('Host', 'http://example.com')
      .set('Accept', 'text/plain, */*')
      .expect('Content-Type', /plain/)
      .expect('Location', 'http://example.com/?param=<script>alert("hax");</script>')
      .expect(302, http.STATUS_CODES[302] + '. Redirecting to http://example.com/?param=%3Cscript%3Ealert(%22hax%22);%3C/script%3E', done);
    })

    it('should include the redirect type', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect(301, 'http://google.com');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/plain, */*')
      .expect('Content-Type', /plain/)
      .expect('Location', 'http://google.com')
      .expect(301, 'Moved Permanently. Redirecting to http://google.com', done);
    })
  })

  describe('when accepting neither text or html', function(){
    it('should respond with an empty body', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .get('/')
      .set('Accept', 'application/octet-stream')
      .expect('location', 'http://google.com')
      .expect('content-length', '0')
      .expect(utils.shouldNotHaveHeader('Content-Type'))
      .expect(302, '', done)
    })
  })
})
