'use strict'

var http = require('http')
var Benchmark = require('benchmark')
var suite = new Benchmark.Suite()
var IncomingMessage = http.IncomingMessage
var ServerResponse = http.ServerResponse

var reply = function(req, res) { res.end(); }

var express = require('../')
var app1 = express()
for (var i = 0; i < 20; i++) {
  app1.get('/' + i, reply)
}
app1.post('/1', reply)
app1.delete('/1', reply)
app1.put('/1', reply)
var app2 = express()
var router
for (var i = 0; i < 20; i++) {
  router = new express.Router()
  app2.use('/' + i, router)
}
router.get('/20', reply)


suite
.add('GET /1', function() {
  var sr = new IncomingMessage()
  sr.url = '/1'
  sr.method = 'GET'
  var im = new ServerResponse(sr)
  app1(sr, im)
})
.add('HEAD /1', function() {
  var sr = new IncomingMessage()
  sr.url = '/1'
  sr.method = 'HEAD'
  var im = new ServerResponse(sr)
  app1(sr, im)
})
.add('POST /1', function() {
  var sr = new IncomingMessage()
  sr.url = '/1'
  sr.method = 'POST'
  var im = new ServerResponse(sr)
  app1(sr, im)
})
.add('PUT /1', function() {
  var sr = new IncomingMessage()
  sr.url = '/1'
  sr.method = 'POST'
  var im = new ServerResponse(sr)
  app1(sr, im)
})
.add('DELETE /1', function() {
  var sr = new IncomingMessage()
  sr.url = '/1'
  sr.method = 'DELETE'
  var im = new ServerResponse(sr)
  app1(sr, im)
})
.add('/10', function() {
  var sr = new IncomingMessage()
  sr.url = '/10'
  sr.method = 'GET'
  var im = new ServerResponse(sr)
  app1(sr, im)
})
.add('/20', function() {
  var sr = new IncomingMessage()
  sr.url = '/10'
  sr.method = 'GET'
  var im = new ServerResponse(sr)
  app1(sr, im)
})
.add('/1/2/3/4/.../19/20', function() {
  var sr = new IncomingMessage()
  sr.url = '/1/2/3/4/5/6/7/8/9/10/11/12/13/14/15/16/17/18/19/20'
  sr.method = 'GET'
  var im = new ServerResponse(sr)
  app1(sr, im)
})
.add('/1/2/3/4/.../19/unknown', function() {
  var sr = new IncomingMessage()
  sr.url = '/1/2/3/4/5/6/7/8/9/10/11/12/13/14/15/16/17/18/19/unknown'
  sr.method = 'GET'
  var im = new ServerResponse(sr)
  app1(sr, im)
})
.add('/unknown', function() {
  var sr = new IncomingMessage()
  sr.url = '/unknown'
  sr.method = 'GET'
  var im = new ServerResponse(sr)
  app1(sr, im)
})
.on('cycle', function(event) {
  console.log(String(event.target))
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'))
})
.run()
