
var express = require('..');
var flod = require('flod');
var version = require('../package.json').version;

flod.Probe.Hooks.extend(require('./_flod_hook'));

var app = express();
var probe = new flod.Probe(app, {server: 'express', version: version});

app.get('/', function (req, res) {
  res.send('hello, world!');
});

app.listen();
