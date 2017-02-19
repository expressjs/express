'use strict'

var http = require('http')
var Benchmark = require('benchmark')
var suite = new Benchmark.Suite()

var sr = {}

var middleware = require('../lib/middleware/query')()

function noop() { }

suite
.add('path', function() {
  middleware({ url: '/foo/the/path' }, sr, noop)
})
.add('path + query', function() {
  middleware({ url: '/foo/the/path?the=query&with=&some=param&or&not' }, sr, noop)
})
.add('path + ?', function() {
  middleware({ url: '/foo/the/path?' }, sr, noop)
})
.add('path + query + hash', function() {
  middleware({ url: '/foo/the/path?the=query&with=&some=param&or&not#hash' }, sr, noop)
})
.add('path + hash', function() {
  middleware({ url: '/foo/the/path#hash' }, sr, noop)
})
.add('path + ? + hash', function() {
  middleware({ url: '/foo/the/path?#hash' }, sr, noop)
})
.on('cycle', function(event) {
  console.log(String(event.target))
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'))
})
.run()
