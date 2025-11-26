'use strict'

const assert = require('node:assert')
const express = require('../')
const path = require('node:path')
const tmpl = require('./support/tmpl')

describe('app', () => {
  describe('.render(name, fn)', () => {
    it('should support absolute paths', (done) => {
      const app = createApp()

      app.locals.user = { name: 'tobi' }

      app.render(path.join(__dirname, 'fixtures', 'user.tmpl'), (err, str) => {
        if (err) return done(err)
        assert.strictEqual(str, '<p>tobi</p>')
        done()
      })
    })

    it('should support absolute paths with "view engine"', (done) => {
      const app = createApp()

      app.set('view engine', 'tmpl')
      app.locals.user = { name: 'tobi' }

      app.render(path.join(__dirname, 'fixtures', 'user'), (err, str) => {
        if (err) return done(err)
        assert.strictEqual(str, '<p>tobi</p>')
        done()
      })
    })

    it('should expose app.locals', (done) => {
      const app = createApp()

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'tobi' }

      app.render('user.tmpl', (err, str) => {
        if (err) return done(err)
        assert.strictEqual(str, '<p>tobi</p>')
        done()
      })
    })

    it('should support index.<engine>', (done) => {
      const app = createApp()

      app.set('views', path.join(__dirname, 'fixtures'))
      app.set('view engine', 'tmpl')

      app.render('blog/post', (err, str) => {
        if (err) return done(err)
        assert.strictEqual(str, '<h1>blog post</h1>')
        done()
      })
    })

    it('should handle render error throws', (done) => {
      const app = express()

      function View (name, options) {
        this.name = name
        this.path = 'fale'
      }

      View.prototype.render = function (options, fn) {
        throw new Error('err!')
      }

      app.set('view', View)

      app.render('something', (err, str) => {
        assert.ok(err)
        assert.strictEqual(err.message, 'err!')
        done()
      })
    })

    describe('when the file does not exist', () => {
      it('should provide a helpful error', (done) => {
        const app = createApp()

        app.set('views', path.join(__dirname, 'fixtures'))
        app.render('rawr.tmpl', (err) => {
          assert.ok(err)
          assert.equal(err.message, 'Failed to lookup view "rawr.tmpl" in views directory "' + path.join(__dirname, 'fixtures') + '"')
          done()
        })
      })
    })

    describe('when an error occurs', () => {
      it('should invoke the callback', (done) => {
        const app = createApp()

        app.set('views', path.join(__dirname, 'fixtures'))

        app.render('user.tmpl', (err) => {
          assert.ok(err)
          assert.equal(err.name, 'RenderError')
          done()
        })
      })
    })

    describe('when an extension is given', () => {
      it('should render the template', (done) => {
        const app = createApp()

        app.set('views', path.join(__dirname, 'fixtures'))

        app.render('email.tmpl', (err, str) => {
          if (err) return done(err)
          assert.strictEqual(str, '<p>This is an email</p>')
          done()
        })
      })
    })

    describe('when "view engine" is given', () => {
      it('should render the template', (done) => {
        const app = createApp()

        app.set('view engine', 'tmpl')
        app.set('views', path.join(__dirname, 'fixtures'))

        app.render('email', (err, str) => {
          if (err) return done(err)
          assert.strictEqual(str, '<p>This is an email</p>')
          done()
        })
      })
    })

    describe('when "views" is given', () => {
      it('should lookup the file in the path', (done) => {
        const app = createApp()

        app.set('views', path.join(__dirname, 'fixtures', 'default_layout'))
        app.locals.user = { name: 'tobi' }

        app.render('user.tmpl', (err, str) => {
          if (err) return done(err)
          assert.strictEqual(str, '<p>tobi</p>')
          done()
        })
      })

      describe('when array of paths', () => {
        it('should lookup the file in the path', (done) => {
          const app = createApp()
          const views = [
            path.join(__dirname, 'fixtures', 'local_layout'),
            path.join(__dirname, 'fixtures', 'default_layout')
          ]

          app.set('views', views)
          app.locals.user = { name: 'tobi' }

          app.render('user.tmpl', (err, str) => {
            if (err) return done(err)
            assert.strictEqual(str, '<span>tobi</span>')
            done()
          })
        })

        it('should lookup in later paths until found', (done) => {
          const app = createApp()
          const views = [
            path.join(__dirname, 'fixtures', 'local_layout'),
            path.join(__dirname, 'fixtures', 'default_layout')
          ]

          app.set('views', views)
          app.locals.name = 'tobi'

          app.render('name.tmpl', (err, str) => {
            if (err) return done(err)
            assert.strictEqual(str, '<p>tobi</p>')
            done()
          })
        })

        it('should error if file does not exist', (done) => {
          const app = createApp()
          const views = [
            path.join(__dirname, 'fixtures', 'local_layout'),
            path.join(__dirname, 'fixtures', 'default_layout')
          ]

          app.set('views', views)
          app.locals.name = 'tobi'

          app.render('pet.tmpl', (err, str) => {
            assert.ok(err)
            assert.equal(err.message, 'Failed to lookup view "pet.tmpl" in views directories "' + views[0] + '" or "' + views[1] + '"')
            done()
          })
        })
      })
    })

    describe('when a "view" constructor is given', () => {
      it('should create an instance of it', (done) => {
        const app = express()

        function View (name, options) {
          this.name = name
          this.path = 'path is required by application.js as a signal of success even though it is not used there.'
        }

        View.prototype.render = function (options, fn) {
          fn(null, 'abstract engine')
        }

        app.set('view', View)

        app.render('something', (err, str) => {
          if (err) return done(err)
          assert.strictEqual(str, 'abstract engine')
          done()
        })
      })
    })

    describe('caching', () => {
      it('should always lookup view without cache', (done) => {
        const app = express()
        let count = 0

        function View (name, options) {
          this.name = name
          this.path = 'fake'
          count++
        }

        View.prototype.render = function (options, fn) {
          fn(null, 'abstract engine')
        }

        app.set('view cache', false)
        app.set('view', View)

        app.render('something', (err, str) => {
          if (err) return done(err)
          assert.strictEqual(count, 1)
          assert.strictEqual(str, 'abstract engine')
          app.render('something', (err, str) => {
            if (err) return done(err)
            assert.strictEqual(count, 2)
            assert.strictEqual(str, 'abstract engine')
            done()
          })
        })
      })

      it('should cache with "view cache" setting', (done) => {
        const app = express()
        let count = 0

        function View (name, options) {
          this.name = name
          this.path = 'fake'
          count++
        }

        View.prototype.render = function (options, fn) {
          fn(null, 'abstract engine')
        }

        app.set('view cache', true)
        app.set('view', View)

        app.render('something', (err, str) => {
          if (err) return done(err)
          assert.strictEqual(count, 1)
          assert.strictEqual(str, 'abstract engine')
          app.render('something', (err, str) => {
            if (err) return done(err)
            assert.strictEqual(count, 1)
            assert.strictEqual(str, 'abstract engine')
            done()
          })
        })
      })
    })
  })

  describe('.render(name, options, fn)', () => {
    it('should render the template', (done) => {
      const app = createApp()

      app.set('views', path.join(__dirname, 'fixtures'))

      const user = { name: 'tobi' }

      app.render('user.tmpl', { user }, (err, str) => {
        if (err) return done(err)
        assert.strictEqual(str, '<p>tobi</p>')
        done()
      })
    })

    it('should expose app.locals', (done) => {
      const app = createApp()

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'tobi' }

      app.render('user.tmpl', {}, (err, str) => {
        if (err) return done(err)
        assert.strictEqual(str, '<p>tobi</p>')
        done()
      })
    })

    it('should give precedence to app.render() locals', (done) => {
      const app = createApp()

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'tobi' }
      const jane = { name: 'jane' }

      app.render('user.tmpl', { user: jane }, (err, str) => {
        if (err) return done(err)
        assert.strictEqual(str, '<p>jane</p>')
        done()
      })
    })

    describe('caching', () => {
      it('should cache with cache option', (done) => {
        const app = express()
        let count = 0

        function View (name, options) {
          this.name = name
          this.path = 'fake'
          count++
        }

        View.prototype.render = function (options, fn) {
          fn(null, 'abstract engine')
        }

        app.set('view cache', false)
        app.set('view', View)

        app.render('something', { cache: true }, (err, str) => {
          if (err) return done(err)
          assert.strictEqual(count, 1)
          assert.strictEqual(str, 'abstract engine')
          app.render('something', { cache: true }, (err, str) => {
            if (err) return done(err)
            assert.strictEqual(count, 1)
            assert.strictEqual(str, 'abstract engine')
            done()
          })
        })
      })
    })
  })
})

function createApp () {
  const app = express()

  app.engine('.tmpl', tmpl)

  return app
}
