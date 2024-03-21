'use strict'

var express = require('../')
  , request = require('supertest')
  , url = require('url');

describe('res', function(){
  describe('.location(url)', function(){
    it('should set the header', function(done){
      var app = express();

      app.use(function(req, res){
        res.location('http://google.com/').end();
      });

      request(app)
      .get('/')
      .expect('Location', 'http://google.com/')
      .expect(200, done)
    })

    it('should preserve trailing slashes when not present', function(done){
      var app = express();

      app.use(function(req, res){
        res.location('http://google.com').end();
      });

      request(app)
      .get('/')
      .expect('Location', 'http://google.com')
      .expect(200, done)
    })

    it('should encode "url"', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.location('https://google.com?q=\u2603 §10').end()
      })

      request(app)
      .get('/')
      .expect('Location', 'https://google.com?q=%E2%98%83%20%C2%A710')
      .expect(200, done)
    })

    it('should not encode bad "url"', function (done) {
      var app = express()

      app.use(function (req, res) {
        // This is here to show a basic check one might do which
        // would pass but then the location header would still be bad
        if (url.parse(req.query.q).host !== 'google.com') {
          res.status(400).end('Bad url');
        }
        res.location(req.query.q).end();
      });

      request(app)
        .get('/?q=http://google.com' + encodeURIComponent('\\@apple.com'))
        .expect(200)
        .expect('Location', 'http://google.com\\@apple.com')
        .end(function (err) {
          if (err) {
            throw err;
          }

          // This ensures that our protocol check is case insensitive
          request(app)
            .get('/?q=HTTP://google.com' + encodeURIComponent('\\@apple.com'))
            .expect(200)
            .expect('Location', 'HTTP://google.com\\@apple.com')
            .end(done)
        });
    });

    it('should not touch already-encoded sequences in "url"', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.location('https://google.com?q=%A710').end()
      })

      request(app)
      .get('/')
      .expect('Location', 'https://google.com?q=%A710')
      .expect(200, done)
    })

    describe('when url is "back"', function () {
      it('should set location from "Referer" header', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.location('back').end()
        })

        request(app)
        .get('/')
        .set('Referer', '/some/page.html')
        .expect('Location', '/some/page.html')
        .expect(200, done)
      })

      it('should set location from "Referrer" header', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.location('back').end()
        })

        request(app)
        .get('/')
        .set('Referrer', '/some/page.html')
        .expect('Location', '/some/page.html')
        .expect(200, done)
      })

      it('should prefer "Referrer" header', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.location('back').end()
        })

        request(app)
        .get('/')
        .set('Referer', '/some/page1.html')
        .set('Referrer', '/some/page2.html')
        .expect('Location', '/some/page2.html')
        .expect(200, done)
      })

      it('should set the header to "/" without referrer', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.location('back').end()
        })

        request(app)
        .get('/')
        .expect('Location', '/')
        .expect(200, done)
      })
    })

    if (typeof URL !== 'undefined') {
      it('should accept an instance of URL', function (done) {
        var app = express();

        app.use(function(req, res){
          res.location(new URL('http://google.com/')).end();
        });

        request(app)
          .get('/')
          .expect('Location', 'http://google.com/')
          .expect(200, done);
      });
    }
  })
})
