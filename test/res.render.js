'use strict'

const express = require('../')
const path = require('node:path')
const request = require('supertest')
const tmpl = require('./support/tmpl')

describe('res', () => {
  describe('.render(name)', () => {
    it('should support absolute paths', (done) => {
      const app = createApp()

      app.locals.user = { name: 'tobi' }

      app.use((req, res) => {
        res.render(path.join(__dirname, 'fixtures', 'user.tmpl'))
      })

      request(app)
        .get('/')
        .expect('<p>tobi</p>', done)
    })

    it('should support absolute paths with "view engine"', (done) => {
      const app = createApp()

      app.locals.user = { name: 'tobi' }
      app.set('view engine', 'tmpl')

      app.use((req, res) => {
        res.render(path.join(__dirname, 'fixtures', 'user'))
      })

      request(app)
        .get('/')
        .expect('<p>tobi</p>', done)
    })

    it('should error without "view engine" set and file extension to a non-engine module', (done) => {
      const app = createApp()

      app.locals.user = { name: 'tobi' }

      app.use((req, res) => {
        res.render(path.join(__dirname, 'fixtures', 'broken.send'))
      })

      request(app)
        .get('/')
        .expect(500, /does not provide a view engine/, done)
    })

    it('should error without "view engine" set and no file extension', (done) => {
      const app = createApp()

      app.locals.user = { name: 'tobi' }

      app.use((req, res) => {
        res.render(path.join(__dirname, 'fixtures', 'user'))
      })

      request(app)
        .get('/')
        .expect(500, /No default engine was specified/, done)
    })

    it('should expose app.locals', (done) => {
      const app = createApp()

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'tobi' }

      app.use((req, res) => {
        res.render('user.tmpl')
      })

      request(app)
        .get('/')
        .expect('<p>tobi</p>', done)
    })

    it('should expose app.locals with `name` property', (done) => {
      const app = createApp()

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.name = 'tobi'

      app.use((req, res) => {
        res.render('name.tmpl')
      })

      request(app)
        .get('/')
        .expect('<p>tobi</p>', done)
    })

    it('should support index.<engine>', (done) => {
      const app = createApp()

      app.set('views', path.join(__dirname, 'fixtures'))
      app.set('view engine', 'tmpl')

      app.use((req, res) => {
        res.render('blog/post')
      })

      request(app)
        .get('/')
        .expect('<h1>blog post</h1>', done)
    })

    describe('when an error occurs', () => {
      it('should next(err)', (done) => {
        const app = createApp()

        app.set('views', path.join(__dirname, 'fixtures'))

        app.use((req, res) => {
          res.render('user.tmpl')
        })

        app.use((err, req, res, next) => {
          res.status(500).send('got error: ' + err.name)
        })

        request(app)
          .get('/')
          .expect(500, 'got error: RenderError', done)
      })
    })

    describe('when "view engine" is given', () => {
      it('should render the template', (done) => {
        const app = createApp()

        app.set('view engine', 'tmpl')
        app.set('views', path.join(__dirname, 'fixtures'))

        app.use((req, res) => {
          res.render('email')
        })

        request(app)
          .get('/')
          .expect('<p>This is an email</p>', done)
      })
    })

    describe('when "views" is given', () => {
      it('should lookup the file in the path', (done) => {
        const app = createApp()

        app.set('views', path.join(__dirname, 'fixtures', 'default_layout'))

        app.use((req, res) => {
          res.render('user.tmpl', { user: { name: 'tobi' } })
        })

        request(app)
          .get('/')
          .expect('<p>tobi</p>', done)
      })

      describe('when array of paths', () => {
        it('should lookup the file in the path', (done) => {
          const app = createApp()
          const views = [
            path.join(__dirname, 'fixtures', 'local_layout'),
            path.join(__dirname, 'fixtures', 'default_layout')
          ]

          app.set('views', views)

          app.use((req, res) => {
            res.render('user.tmpl', { user: { name: 'tobi' } })
          })

          request(app)
            .get('/')
            .expect('<span>tobi</span>', done)
        })

        it('should lookup in later paths until found', (done) => {
          const app = createApp()
          const views = [
            path.join(__dirname, 'fixtures', 'local_layout'),
            path.join(__dirname, 'fixtures', 'default_layout')
          ]

          app.set('views', views)

          app.use((req, res) => {
            res.render('name.tmpl', { name: 'tobi' })
          })

          request(app)
            .get('/')
            .expect('<p>tobi</p>', done)
        })
      })
    })
  })

  describe('.render(name, option)', () => {
    it('should render the template', (done) => {
      const app = createApp()

      app.set('views', path.join(__dirname, 'fixtures'))

      const user = { name: 'tobi' }

      app.use((req, res) => {
        res.render('user.tmpl', { user })
      })

      request(app)
        .get('/')
        .expect('<p>tobi</p>', done)
    })

    it('should expose app.locals', (done) => {
      const app = createApp()

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'tobi' }

      app.use((req, res) => {
        res.render('user.tmpl')
      })

      request(app)
        .get('/')
        .expect('<p>tobi</p>', done)
    })

    it('should expose res.locals', (done) => {
      const app = createApp()

      app.set('views', path.join(__dirname, 'fixtures'))

      app.use((req, res) => {
        res.locals.user = { name: 'tobi' }
        res.render('user.tmpl')
      })

      request(app)
        .get('/')
        .expect('<p>tobi</p>', done)
    })

    it('should give precedence to res.locals over app.locals', (done) => {
      const app = createApp()

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'tobi' }

      app.use((req, res) => {
        res.locals.user = { name: 'jane' }
        res.render('user.tmpl', {})
      })

      request(app)
        .get('/')
        .expect('<p>jane</p>', done)
    })

    it('should give precedence to res.render() locals over res.locals', (done) => {
      const app = createApp()

      app.set('views', path.join(__dirname, 'fixtures'))
      const jane = { name: 'jane' }

      app.use((req, res) => {
        res.locals.user = { name: 'tobi' }
        res.render('user.tmpl', { user: jane })
      })

      request(app)
        .get('/')
        .expect('<p>jane</p>', done)
    })

    it('should give precedence to res.render() locals over app.locals', (done) => {
      const app = createApp()

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'tobi' }
      const jane = { name: 'jane' }

      app.use((req, res) => {
        res.render('user.tmpl', { user: jane })
      })

      request(app)
        .get('/')
        .expect('<p>jane</p>', done)
    })
  })

  describe('.render(name, options, fn)', () => {
    it('should pass the resulting string', (done) => {
      const app = createApp()

      app.set('views', path.join(__dirname, 'fixtures'))

      app.use((req, res) => {
        const tobi = { name: 'tobi' }
        res.render('user.tmpl', { user: tobi }, (err, html) => {
          html = html.replace('tobi', 'loki')
          res.end(html)
        })
      })

      request(app)
        .get('/')
        .expect('<p>loki</p>', done)
    })
  })

  describe('.render(name, fn)', () => {
    it('should pass the resulting string', (done) => {
      const app = createApp()

      app.set('views', path.join(__dirname, 'fixtures'))

      app.use((req, res) => {
        res.locals.user = { name: 'tobi' }
        res.render('user.tmpl', (err, html) => {
          html = html.replace('tobi', 'loki')
          res.end(html)
        })
      })

      request(app)
        .get('/')
        .expect('<p>loki</p>', done)
    })

    describe('when an error occurs', () => {
      it('should pass it to the callback', (done) => {
        const app = createApp()

        app.set('views', path.join(__dirname, 'fixtures'))

        app.use((req, res) => {
          res.render('user.tmpl', (err) => {
            if (err) {
              res.status(500).send('got error: ' + err.name)
            }
          })
        })

        request(app)
          .get('/')
          .expect(500, 'got error: RenderError', done)
      })
    })
  })
})

function createApp () {
  const app = express()

  app.engine('.tmpl', tmpl)

  return app
}
