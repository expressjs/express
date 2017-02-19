'use strict'

var http = require('http')
var Benchmark = require('benchmark')
var suite = new Benchmark.Suite()
var IncomingMessage = http.IncomingMessage
var ServerResponse = http.ServerResponse

var app = require('../')()
app.disable('x-powered-by')
var middleware = require('../lib/middleware/init').init(app)

function noop() { }

suite
.add('init', function() {
  var sr = new IncomingMessage()
  var im = new ServerResponse(sr)

  middleware(im, sr, noop)
})
.on('cycle', function(event) {
  console.log(String(event.target))
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'))
})
.run()
