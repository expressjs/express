'use strict'

/**
 * Module dependencies.
 */

const express = require('../../../')
const fs = require('node:fs')
const path = require('node:path')

module.exports = function (parent, options) {
  const dir = path.join(__dirname, '..', 'controllers')
  const verbose = options.verbose
  fs.readdirSync(dir).forEach((dirname) => {
    const subdir = path.join(dir, dirname)
    if (!fs.statSync(subdir).isDirectory()) return
    verbose && console.log('\n   %s:', dirname)
    // eslint-disable-next-line global-require
    const obj = require(subdir)
    const name = obj.name || dirname
    const prefix = obj.prefix || ''
    const app = express()
    let handler
    let method
    let url

    // allow specifying the view engine
    if (obj.engine) app.set('view engine', obj.engine)
    app.set('views', path.join(__dirname, '..', 'controllers', name, 'views'))

    // generate routes based
    // on the exported methods
    for (const key in obj) {
      // "reserved" exports
      if (~['name', 'prefix', 'engine', 'before'].indexOf(key)) continue
      // route exports
      switch (key) {
        case 'show':
          method = 'get'
          url = '/' + name + '/:' + name + '_id'
          break
        case 'list':
          method = 'get'
          url = '/' + name + 's'
          break
        case 'edit':
          method = 'get'
          url = '/' + name + '/:' + name + '_id/edit'
          break
        case 'update':
          method = 'put'
          url = '/' + name + '/:' + name + '_id'
          break
        case 'create':
          method = 'post'
          url = '/' + name
          break
        case 'index':
          method = 'get'
          url = '/'
          break
        default:
          /* istanbul ignore next */
          throw new Error('unrecognized route: ' + name + '.' + key)
      }

      // setup
      handler = obj[key]
      url = prefix + url

      // before middleware support
      if (obj.before) {
        app[method](url, obj.before, handler)
        verbose && console.log('     %s %s -> before -> %s', method.toUpperCase(), url, key)
      } else {
        app[method](url, handler)
        verbose && console.log('     %s %s -> %s', method.toUpperCase(), url, key)
      }
    }

    // mount the app
    parent.use(app)
  })
}
