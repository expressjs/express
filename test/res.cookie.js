'use strict'

const express = require('../')
const request = require('supertest')
const cookieParser = require('cookie-parser')

describe('res', () => {
  describe('.cookie(name, object)', () => {
    it('should generate a JSON cookie', (done) => {
      const app = express()

      app.use((req, res) => {
        res.cookie('user', { name: 'tobi' }).end()
      })

      request(app)
        .get('/')
        .expect('Set-Cookie', 'user=j%3A%7B%22name%22%3A%22tobi%22%7D; Path=/')
        .expect(200, done)
    })
  })

  describe('.cookie(name, string)', () => {
    it('should set a cookie', (done) => {
      const app = express()

      app.use((req, res) => {
        res.cookie('name', 'tobi').end()
      })

      request(app)
        .get('/')
        .expect('Set-Cookie', 'name=tobi; Path=/')
        .expect(200, done)
    })

    it('should allow multiple calls', (done) => {
      const app = express()

      app.use((req, res) => {
        res.cookie('name', 'tobi')
        res.cookie('age', 1)
        res.cookie('gender', '?')
        res.end()
      })

      request(app)
        .get('/')
        .expect('Set-Cookie', 'name=tobi; Path=/,age=1; Path=/,gender=%3F; Path=/')
        .expect(200, done)
    })
  })

  describe('.cookie(name, string, options)', () => {
    it('should set params', (done) => {
      const app = express()

      app.use((req, res) => {
        res.cookie('name', 'tobi', { httpOnly: true, secure: true })
        res.end()
      })

      request(app)
        .get('/')
        .expect('Set-Cookie', 'name=tobi; Path=/; HttpOnly; Secure')
        .expect(200, done)
    })

    describe('expires', () => {
      it('should throw on invalid date', (done) => {
        const app = express()

        app.use((req, res) => {
          res.cookie('name', 'tobi', { expires: new Date(NaN) })
          res.end()
        })

        request(app)
          .get('/')
          .expect(500, /option expires is invalid/, done)
      })
    })

    describe('partitioned', () => {
      it('should set partitioned', (done) => {
        const app = express()

        app.use((req, res) => {
          res.cookie('name', 'tobi', { partitioned: true })
          res.end()
        })

        request(app)
          .get('/')
          .expect('Set-Cookie', 'name=tobi; Path=/; Partitioned')
          .expect(200, done)
      })
    })

    describe('maxAge', () => {
      it('should set relative expires', (done) => {
        const app = express()

        app.use((req, res) => {
          res.cookie('name', 'tobi', { maxAge: 1000 })
          res.end()
        })

        request(app)
          .get('/')
          .expect('Set-Cookie', /name=tobi; Max-Age=1; Path=\/; Expires=/)
          .expect(200, done)
      })

      it('should set max-age', (done) => {
        const app = express()

        app.use((req, res) => {
          res.cookie('name', 'tobi', { maxAge: 1000 })
          res.end()
        })

        request(app)
          .get('/')
          .expect('Set-Cookie', /Max-Age=1/, done)
      })

      it('should not mutate the options object', (done) => {
        const app = express()

        const options = { maxAge: 1000 }
        const optionsCopy = { ...options }

        app.use((req, res) => {
          res.cookie('name', 'tobi', options)
          res.json(options)
        })

        request(app)
          .get('/')
          .expect(200, optionsCopy, done)
      })

      it('should not throw on null', (done) => {
        const app = express()

        app.use((req, res) => {
          res.cookie('name', 'tobi', { maxAge: null })
          res.end()
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('Set-Cookie', 'name=tobi; Path=/')
          .end(done)
      })

      it('should not throw on undefined', (done) => {
        const app = express()

        app.use((req, res) => {
          res.cookie('name', 'tobi', { maxAge: undefined })
          res.end()
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('Set-Cookie', 'name=tobi; Path=/')
          .end(done)
      })

      it('should throw an error with invalid maxAge', (done) => {
        const app = express()

        app.use((req, res) => {
          res.cookie('name', 'tobi', { maxAge: 'foobar' })
          res.end()
        })

        request(app)
          .get('/')
          .expect(500, /option maxAge is invalid/, done)
      })
    })

    describe('priority', () => {
      it('should set low priority', (done) => {
        const app = express()

        app.use((req, res) => {
          res.cookie('name', 'tobi', { priority: 'low' })
          res.end()
        })

        request(app)
          .get('/')
          .expect('Set-Cookie', /Priority=Low/)
          .expect(200, done)
      })

      it('should set medium priority', (done) => {
        const app = express()

        app.use((req, res) => {
          res.cookie('name', 'tobi', { priority: 'medium' })
          res.end()
        })

        request(app)
          .get('/')
          .expect('Set-Cookie', /Priority=Medium/)
          .expect(200, done)
      })

      it('should set high priority', (done) => {
        const app = express()

        app.use((req, res) => {
          res.cookie('name', 'tobi', { priority: 'high' })
          res.end()
        })

        request(app)
          .get('/')
          .expect('Set-Cookie', /Priority=High/)
          .expect(200, done)
      })

      it('should throw with invalid priority', (done) => {
        const app = express()

        app.use((req, res) => {
          res.cookie('name', 'tobi', { priority: 'foobar' })
          res.end()
        })

        request(app)
          .get('/')
          .expect(500, /option priority is invalid/, done)
      })
    })

    describe('signed', () => {
      it('should generate a signed JSON cookie', (done) => {
        const app = express()

        app.use(cookieParser('foo bar baz'))

        app.use((req, res) => {
          res.cookie('user', { name: 'tobi' }, { signed: true }).end()
        })

        request(app)
          .get('/')
          .expect('Set-Cookie', 'user=s%3Aj%3A%7B%22name%22%3A%22tobi%22%7D.K20xcwmDS%2BPb1rsD95o5Jm5SqWs1KteqdnynnB7jkTE; Path=/')
          .expect(200, done)
      })
    })

    describe('signed without secret', () => {
      it('should throw an error', (done) => {
        const app = express()

        app.use(cookieParser())

        app.use((req, res) => {
          res.cookie('name', 'tobi', { signed: true }).end()
        })

        request(app)
          .get('/')
          .expect(500, /secret\S+ required for signed cookies/, done)
      })
    })

    describe('.signedCookie(name, string)', () => {
      it('should set a signed cookie', (done) => {
        const app = express()

        app.use(cookieParser('foo bar baz'))

        app.use((req, res) => {
          res.cookie('name', 'tobi', { signed: true }).end()
        })

        request(app)
          .get('/')
          .expect('Set-Cookie', 'name=s%3Atobi.xJjV2iZ6EI7C8E5kzwbfA9PVLl1ZR07UTnuTgQQ4EnQ; Path=/')
          .expect(200, done)
      })
    })
  })
})
