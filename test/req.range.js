'use strict'

var express = require('..');
var request = require('supertest')

describe('req', function(){
  describe('.range(size)', function(){
    it('should return parsed ranges', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.range(120))
      })

      request(app)
      .get('/')
      .set('Range', 'bytes=0-50,51-100')
      .expect(200, '[{"start":0,"end":50},{"start":51,"end":100}]', done)
    })

    it('should cap to the given size', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.range(75))
      })

      request(app)
      .get('/')
      .set('Range', 'bytes=0-100')
      .expect(200, '[{"start":0,"end":74}]', done)
    })

    it('should cap to the given size when open-ended', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.range(75))
      })

      request(app)
      .get('/')
      .set('Range', 'bytes=0-')
      .expect(200, '[{"start":0,"end":74}]', done)
    })

    it('should throw TypeError for invalid size', function () {
      var app = express();

      app.use(function (req, res) {
        try {
          req.range(-1);
        } catch (err) {
          res.status(500).send(err.name + ': ' + err.message);
          return;
        }
        res.send('no error');
      });

      return request(app)
        .get('/')
        .set('Range', 'bytes=0-10')
        .expect(500)
        .expect(/TypeError: size must be a non-negative integer to req\.range/);
    });

    it('should throw TypeError for various invalid size types', function () {
      var app = express();
      var testCases = [
        { value: 'string', label: 'string' },
        { value: {}, label: 'object' },
        { value: [], label: 'array' },
        { value: null, label: 'null' },
        { value: undefined, label: 'undefined' },
        { value: 1.5, label: 'float' },
        { value: NaN, label: 'NaN' },
        { value: Infinity, label: 'Infinity' }
      ];

      app.use(function (req, res) {
        var type = req.query.type;
        var value = testCases.find(c => c.label === type).value;

        try {
          req.range(value);
          res.send('no error');
        } catch (err) {
          res.status(500).send(err.name + ': ' + err.message);
        }
      });

      // Run all tests in sequence
      return Promise.all(testCases.map(function (testCase) {
        return request(app)
      .get('/?type=' + testCase.label)
      .set('Range', 'bytes=0-10')
      .expect(500)
      .expect(/TypeError: size must be a non-negative integer to req\.range/);
      }));
    });

    it('should have a .type', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.range(120).type)
      })

      request(app)
      .get('/')
      .set('Range', 'bytes=0-100')
      .expect(200, '"bytes"', done)
    })

    it('should accept any type', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.range(120).type)
      })

      request(app)
      .get('/')
      .set('Range', 'users=0-2')
      .expect(200, '"users"', done)
    })

    it('should return undefined if no range', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.send(String(req.range(120)))
      })

      request(app)
      .get('/')
      .expect(200, 'undefined', done)
    })
  })

  describe('.range(size, options)', function(){
    describe('with "combine: true" option', function(){
      it('should return combined ranges', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.json(req.range(120, {
            combine: true
          }))
        })

        request(app)
        .get('/')
        .set('Range', 'bytes=0-50,51-100')
        .expect(200, '[{"start":0,"end":100}]', done)
      })
    })
  })
})
