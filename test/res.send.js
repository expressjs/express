'use strict'

const assert = require('node:assert')
const { Buffer } = require('node:buffer')
const express = require('../')
const { methods } = require('../lib/utils')
const request = require('supertest')
const utils = require('./support/utils')

const { shouldSkipQuery } = require('./support/utils')

describe('res', () => {
  describe('.send()', () => {
    it('should set body to ""', (done) => {
      const app = express()

      app.use((req, res) => {
        res.send()
      })

      request(app)
        .get('/')
        .expect(200, '', done)
    })
  })

  describe('.send(null)', () => {
    it('should set body to ""', (done) => {
      const app = express()

      app.use((req, res) => {
        res.send(null)
      })

      request(app)
        .get('/')
        .expect('Content-Length', '0')
        .expect(200, '', done)
    })
  })

  describe('.send(undefined)', () => {
    it('should set body to ""', (done) => {
      const app = express()

      app.use((req, res) => {
        res.send(undefined)
      })

      request(app)
        .get('/')
        .expect(200, '', done)
    })
  })

  describe('.send(Number)', () => {
    it('should send as application/json', (done) => {
      const app = express()

      app.use((req, res) => {
        res.send(1000)
      })

      request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '1000', done)
    })
  })

  describe('.send(String)', () => {
    it('should send as html', (done) => {
      const app = express()

      app.use((req, res) => {
        res.send('<p>hey</p>')
      })

      request(app)
        .get('/')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200, '<p>hey</p>', done)
    })

    it('should set ETag', (done) => {
      const app = express()

      app.use((req, res) => {
        const str = Array(1000).join('-')
        res.send(str)
      })

      request(app)
        .get('/')
        .expect('ETag', 'W/"3e7-qPnkJ3CVdVhFJQvUBfF10TmVA7g"')
        .expect(200, done)
    })

    it('should not override Content-Type', (done) => {
      const app = express()

      app.use((req, res) => {
        res.set('Content-Type', 'text/plain').send('hey')
      })

      request(app)
        .get('/')
        .expect('Content-Type', 'text/plain; charset=utf-8')
        .expect(200, 'hey', done)
    })

    it('should override charset in Content-Type', (done) => {
      const app = express()

      app.use((req, res) => {
        res.set('Content-Type', 'text/plain; charset=iso-8859-1').send('hey')
      })

      request(app)
        .get('/')
        .expect('Content-Type', 'text/plain; charset=utf-8')
        .expect(200, 'hey', done)
    })

    it('should keep charset in Content-Type for Buffers', (done) => {
      const app = express()

      app.use((req, res) => {
        res.set('Content-Type', 'text/plain; charset=iso-8859-1').send(Buffer.from('hi'))
      })

      request(app)
        .get('/')
        .expect('Content-Type', 'text/plain; charset=iso-8859-1')
        .expect(200, 'hi', done)
    })
  })

  describe('.send(Buffer)', () => {
    it('should send as octet-stream', (done) => {
      const app = express()

      app.use((req, res) => {
        res.send(Buffer.from('hello'))
      })

      request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', 'application/octet-stream')
        .expect(utils.shouldHaveBody(Buffer.from('hello')))
        .end(done)
    })

    it('should set ETag', (done) => {
      const app = express()

      app.use((req, res) => {
        res.send(Buffer.alloc(999, '-'))
      })

      request(app)
        .get('/')
        .expect('ETag', 'W/"3e7-qPnkJ3CVdVhFJQvUBfF10TmVA7g"')
        .expect(200, done)
    })

    it('should not override Content-Type', (done) => {
      const app = express()

      app.use((req, res) => {
        res.set('Content-Type', 'text/plain').send(Buffer.from('hey'))
      })

      request(app)
        .get('/')
        .expect('Content-Type', 'text/plain; charset=utf-8')
        .expect(200, 'hey', done)
    })

    it('should accept Uint8Array', (done) => {
      const app = express()
      app.use((req, res) => {
        const encodedHey = new TextEncoder().encode('hey')
        res.set('Content-Type', 'text/plain').send(encodedHey)
      })

      request(app)
        .get('/')
        .expect('Content-Type', 'text/plain; charset=utf-8')
        .expect(200, 'hey', done)
    })

    it('should not override ETag', (done) => {
      const app = express()

      app.use((req, res) => {
        res.type('text/plain').set('ETag', '"foo"').send(Buffer.from('hey'))
      })

      request(app)
        .get('/')
        .expect('ETag', '"foo"')
        .expect(200, 'hey', done)
    })
  })

  describe('.send(Object)', () => {
    it('should send as application/json', (done) => {
      const app = express()

      app.use((req, res) => {
        res.send({ name: 'tobi' })
      })

      request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '{"name":"tobi"}', done)
    })
  })

  describe('when the request method is HEAD', () => {
    it('should ignore the body', (done) => {
      const app = express()

      app.use((req, res) => {
        res.send('yay')
      })

      request(app)
        .head('/')
        .expect(200)
        .expect(utils.shouldNotHaveBody())
        .end(done)
    })
  })

  describe('when .statusCode is 204', () => {
    it('should strip Content-* fields, Transfer-Encoding field, and body', (done) => {
      const app = express()

      app.use((req, res) => {
        res.status(204).set('Transfer-Encoding', 'chunked').send('foo')
      })

      request(app)
        .get('/')
        .expect(utils.shouldNotHaveHeader('Content-Type'))
        .expect(utils.shouldNotHaveHeader('Content-Length'))
        .expect(utils.shouldNotHaveHeader('Transfer-Encoding'))
        .expect(204, '', done)
    })
  })

  describe('when .statusCode is 205', () => {
    it('should strip Transfer-Encoding field and body, set Content-Length', (done) => {
      const app = express()

      app.use((req, res) => {
        res.status(205).set('Transfer-Encoding', 'chunked').send('foo')
      })

      request(app)
        .get('/')
        .expect(utils.shouldNotHaveHeader('Transfer-Encoding'))
        .expect('Content-Length', '0')
        .expect(205, '', done)
    })
  })

  describe('when .statusCode is 304', () => {
    it('should strip Content-* fields, Transfer-Encoding field, and body', (done) => {
      const app = express()

      app.use((req, res) => {
        res.status(304).set('Transfer-Encoding', 'chunked').send('foo')
      })

      request(app)
        .get('/')
        .expect(utils.shouldNotHaveHeader('Content-Type'))
        .expect(utils.shouldNotHaveHeader('Content-Length'))
        .expect(utils.shouldNotHaveHeader('Transfer-Encoding'))
        .expect(304, '', done)
    })
  })

  it('should always check regardless of length', (done) => {
    const app = express()
    const etag = '"asdf"'

    app.use((req, res, next) => {
      res.set('ETag', etag)
      res.send('hey')
    })

    request(app)
      .get('/')
      .set('If-None-Match', etag)
      .expect(304, done)
  })

  it('should respond with 304 Not Modified when fresh', (done) => {
    const app = express()
    const etag = '"asdf"'

    app.use((req, res) => {
      const str = Array(1000).join('-')
      res.set('ETag', etag)
      res.send(str)
    })

    request(app)
      .get('/')
      .set('If-None-Match', etag)
      .expect(304, done)
  })

  it('should not perform freshness check unless 2xx or 304', (done) => {
    const app = express()
    const etag = '"asdf"'

    app.use((req, res, next) => {
      res.status(500)
      res.set('ETag', etag)
      res.send('hey')
    })

    request(app)
      .get('/')
      .set('If-None-Match', etag)
      .expect('hey')
      .expect(500, done)
  })

  it('should not support jsonp callbacks', (done) => {
    const app = express()

    app.use((req, res) => {
      res.send({ foo: 'bar' })
    })

    request(app)
      .get('/?callback=foo')
      .expect('{"foo":"bar"}', done)
  })

  it('should be chainable', (done) => {
    const app = express()

    app.use((req, res) => {
      assert.equal(res.send('hey'), res)
    })

    request(app)
      .get('/')
      .expect(200, 'hey', done)
  })

  describe('"etag" setting', () => {
    describe('when enabled', () => {
      it('should send ETag', (done) => {
        const app = express()

        app.use((req, res) => {
          res.send('kajdslfkasdf')
        })

        app.enable('etag')

        request(app)
          .get('/')
          .expect('ETag', 'W/"c-IgR/L5SF7CJQff4wxKGF/vfPuZ0"')
          .expect(200, done)
      })

      methods.forEach((method) => {
        if (method === 'connect') return

        it('should send ETag in response to ' + method.toUpperCase() + ' request', function (done) {
          if (method === 'query' && shouldSkipQuery(process.versions.node)) {
            this.skip()
          }
          const app = express()

          app[method]('/', (req, res) => {
            res.send('kajdslfkasdf')
          })

          request(app)[method]('/')
            .expect('ETag', 'W/"c-IgR/L5SF7CJQff4wxKGF/vfPuZ0"')
            .expect(200, done)
        })
      })

      it('should send ETag for empty string response', (done) => {
        const app = express()

        app.use((req, res) => {
          res.send('')
        })

        app.enable('etag')

        request(app)
          .get('/')
          .expect('ETag', 'W/"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"')
          .expect(200, done)
      })

      it('should send ETag for long response', (done) => {
        const app = express()

        app.use((req, res) => {
          const str = Array(1000).join('-')
          res.send(str)
        })

        app.enable('etag')

        request(app)
          .get('/')
          .expect('ETag', 'W/"3e7-qPnkJ3CVdVhFJQvUBfF10TmVA7g"')
          .expect(200, done)
      })

      it('should not override ETag when manually set', (done) => {
        const app = express()

        app.use((req, res) => {
          res.set('etag', '"asdf"')
          res.send('hello!')
        })

        app.enable('etag')

        request(app)
          .get('/')
          .expect('ETag', '"asdf"')
          .expect(200, done)
      })

      it('should not send ETag for res.send()', (done) => {
        const app = express()

        app.use((req, res) => {
          res.send()
        })

        app.enable('etag')

        request(app)
          .get('/')
          .expect(utils.shouldNotHaveHeader('ETag'))
          .expect(200, done)
      })
    })

    describe('when disabled', () => {
      it('should send no ETag', (done) => {
        const app = express()

        app.use((req, res) => {
          const str = Array(1000).join('-')
          res.send(str)
        })

        app.disable('etag')

        request(app)
          .get('/')
          .expect(utils.shouldNotHaveHeader('ETag'))
          .expect(200, done)
      })

      it('should send ETag when manually set', (done) => {
        const app = express()

        app.disable('etag')

        app.use((req, res) => {
          res.set('etag', '"asdf"')
          res.send('hello!')
        })

        request(app)
          .get('/')
          .expect('ETag', '"asdf"')
          .expect(200, done)
      })
    })

    describe('when "strong"', () => {
      it('should send strong ETag', (done) => {
        const app = express()

        app.set('etag', 'strong')

        app.use((req, res) => {
          res.send('hello, world!')
        })

        request(app)
          .get('/')
          .expect('ETag', '"d-HwnTDHB9U/PRbFMN1z1wps51lqk"')
          .expect(200, done)
      })
    })

    describe('when "weak"', () => {
      it('should send weak ETag', (done) => {
        const app = express()

        app.set('etag', 'weak')

        app.use((req, res) => {
          res.send('hello, world!')
        })

        request(app)
          .get('/')
          .expect('ETag', 'W/"d-HwnTDHB9U/PRbFMN1z1wps51lqk"')
          .expect(200, done)
      })
    })

    describe('when a function', () => {
      it('should send custom ETag', (done) => {
        const app = express()

        app.set('etag', (body, encoding) => {
          const chunk = !Buffer.isBuffer(body)
            ? Buffer.from(body, encoding)
            : body
          assert.strictEqual(chunk.toString(), 'hello, world!')
          return '"custom"'
        })

        app.use((req, res) => {
          res.send('hello, world!')
        })

        request(app)
          .get('/')
          .expect('ETag', '"custom"')
          .expect(200, done)
      })

      it('should not send falsy ETag', (done) => {
        const app = express()

        app.set('etag', (body, encoding) => undefined)

        app.use((req, res) => {
          res.send('hello, world!')
        })

        request(app)
          .get('/')
          .expect(utils.shouldNotHaveHeader('ETag'))
          .expect(200, done)
      })
    })
  })
})
