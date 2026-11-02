'use strict';

var assert = require('node:assert');
var Buffer = require('node:buffer').Buffer;
var vm = require('node:vm');
var express = require('..');
var request = require('supertest');

function typedWindow (Type, values) {
  var padded = new Type(values.length + 2);
  padded.set(values, 1);
  return padded.subarray(1, -1);
}

function rawBytes (view) {
  return Buffer.from(Buffer.from(view.buffer, view.byteOffset, view.byteLength));
}

function binaryParser (res, callback) {
  var chunks = [];
  res.on('data', function (chunk) { chunks.push(chunk); });
  res.on('end', function () { callback(null, Buffer.concat(chunks)); });
  res.on('error', callback);
}

var views = [
  { name: 'Uint16Array window', create: function () { return typedWindow(Uint16Array, [0x0102, 0x0304]); } },
  { name: 'Int16Array window', create: function () { return typedWindow(Int16Array, [-1, -32768]); } },
  { name: 'Uint32Array window', create: function () { return typedWindow(Uint32Array, [0x01020304]); } },
  { name: 'Float64Array window', create: function () { return typedWindow(Float64Array, [-0, Infinity]); } },
  { name: 'BigInt64Array window', create: function () { return typedWindow(BigInt64Array, [-1n, 0x0102030405060708n]); } },
  { name: 'DataView window', create: function () {
    return new DataView(new Uint8Array([0xaa, 0, 0xff, 0x80, 0xbb]).buffer, 1, 3);
  } },
  { name: 'empty DataView window', create: function () { return new DataView(new ArrayBuffer(4), 2, 0); } },
  { name: 'large Uint16Array', create: function () { return new Uint16Array(1001).fill(0x0102); } },
  { name: 'cross-realm Uint16Array', create: function () { return vm.runInNewContext('new Uint16Array([0x0102, 0x0304])'); } },
  { name: 'cross-realm DataView', create: function () {
    return vm.runInNewContext('new DataView(new Uint8Array([170, 0, 255, 187]).buffer, 1, 2)');
  } },
  { name: 'shared-buffer Uint16Array', create: function () {
    var view = new Uint16Array(new SharedArrayBuffer(8), 2, 2);
    view.set([0x0102, 0x0304]);
    return view;
  } },
  { name: 'Uint8Array control', create: function () { return typedWindow(Uint8Array, [0, 0xff, 0x80]); } },
  { name: 'Buffer window control', create: function () { return Buffer.from([0xaa, 0, 0xff, 0xbb]).subarray(1, 3); } }
];

describe('res.send ArrayBuffer views', function () {
  views.forEach(function (view) {
    [false, 'weak', 'strong'].forEach(function (etag) {
      it('sends ' + view.name + ' with etag=' + etag, function (done) {
        var app = express();
        var body = view.create();
        var expected = rawBytes(body);
        app.set('etag', etag);
        app.use(function (req, res) { res.send(body); });

        request(app).get('/')
          .buffer(true).parse(binaryParser)
          .expect('Content-Type', 'application/octet-stream')
          .expect('Content-Length', String(expected.length))
          .expect(200)
          .expect(function (res) {
            assert.deepStrictEqual(res.body, expected);
            assert.strictEqual(res.headers.etag, etag ? app.get('etag fn')(expected) : undefined);
          })
          .end(done);
      });
    });

    it('sends ' + view.name + ' with chunked encoding and a custom type', function (done) {
      var app = express();
      var body = view.create();
      var expected = rawBytes(body);
      app.use(function (req, res) {
        res.set('Content-Type', 'application/custom');
        res.set('Transfer-Encoding', 'chunked');
        res.set('ETag', '"caller-tag"');
        res.send(body);
      });
      request(app).get('/')
        .buffer(true).parse(binaryParser)
        .expect('Content-Type', 'application/custom')
        .expect('Transfer-Encoding', 'chunked')
        .expect('ETag', '"caller-tag"')
        .expect(200)
        .expect(function (res) {
          assert.strictEqual(res.headers['content-length'], undefined);
          assert.deepStrictEqual(res.body, expected);
        })
        .end(done);
    });

    it('reports byte length without sending ' + view.name + ' for HEAD', function (done) {
      var app = express();
      var body = view.create();
      var expected = rawBytes(body);
      app.use(function (req, res) { res.send(body); });
      request(app).head('/')
        .buffer(true).parse(binaryParser)
        .expect('Content-Length', String(expected.length))
        .expect('ETag', app.get('etag fn')(expected))
        .expect(200)
        .expect(function (res) {
          assert.strictEqual(res.text, undefined);
          assert.deepStrictEqual(res.body, {});
        })
        .end(done);
    });

    it('revalidates ' + view.name + ' using the raw-byte ETag', function (done) {
      var app = express();
      var body = view.create();
      var expected = rawBytes(body);
      app.use(function (req, res) { res.send(body); });
      request(app).get('/')
        .set('If-None-Match', app.get('etag fn')(expected))
        .expect(304)
        .expect(function (res) {
          assert.strictEqual(res.headers['content-length'], undefined);
          assert.strictEqual(res.text, '');
        })
        .end(done);
    });
  });
});
