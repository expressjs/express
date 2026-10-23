'use strict'

process.env.NO_DEPRECATION = 'body-parser,express';

// The "env" setting is no longer derived from NODE_ENV. Default every app
// created by the test suite to "test" so error details are exposed in
// responses and the default error logger stays quiet, matching what
// NODE_ENV=test provided before.
var application = require('../../lib/application')
var defaultConfiguration = application.defaultConfiguration

application.defaultConfiguration = function testDefaultConfiguration () {
  defaultConfiguration.call(this)
  this.set('env', 'test')
}

// expose the untouched defaults for tests that assert on them
exports.defaultConfiguration = defaultConfiguration
