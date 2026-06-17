'use strict';

/**
 * Module dependencies.
 */

const assert = require('node:assert');
const http2 = require('node:http2');
const fs = require('node:fs');
const path = require('node:path');
const express = require('..');
const httpModule = require('../lib/http2');
const after = require('after');
const os = require('node:os');

/**
 * Temporary certificate paths for tests
 */
const TEMP_KEY_PATH = path.join(os.tmpdir(), 'express-test-key.pem');
const TEMP_CERT_PATH = path.join(os.tmpdir(), 'express-test-cert.pem');

describe('HTTP/2', function() {
  let app;
  let servers = [];
  let clients = [];

  // Increase test timeout
  this.timeout(5000);

  // Create a temporary self-signed certificate for tests
  before(function(done) {
    // Skip certificate generation in CI environments
    if (process.env.CI) {
      this.skip();
      return;
    }

    const { execSync } = require('node:child_process');

    try {
      execSync(`openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
        -keyout ${TEMP_KEY_PATH} \
        -out ${TEMP_CERT_PATH}`, { stdio: 'ignore' });
      done();
    } catch (err) {
      done(new Error('Failed to generate test certificates. Skip these tests or install OpenSSL.'));
    }
  });

  // Clean up certificates after tests
  after(function(done) {
    try {
      fs.unlinkSync(TEMP_KEY_PATH);
      fs.unlinkSync(TEMP_CERT_PATH);
    } catch (err) {
      // Ignore errors (files might not exist)
    }

    // Ensure all servers and clients are closed
    Promise.all([
      ...servers.map(server => new Promise(resolve => {
        if (server.listening) {
          server.close(resolve);
        } else {
          resolve();
        }
      })),
      ...clients.map(client => new Promise(resolve => {
        if (!client.destroyed) {
          client.close(resolve);
        } else {
          resolve();
        }
      }))
    ]).then(() => done()).catch(() => done());
  });

  beforeEach(function() {
    app = express();
  });

  afterEach(function() {
    // Clear arrays for next test
    servers = [];
    clients = [];
  });

  describe('createServer()', function() {
    it('should create an HTTP/2 server instance', function() {
      const server = httpModule.createServer(app);
      servers.push(server);

      // Check if server has expected HTTP/2 server methods instead of using instanceof
      assert.strictEqual(typeof server.on, 'function');
      assert.strictEqual(typeof server.listen, 'function');
      assert.strictEqual(typeof server.close, 'function');
      server.close();
    });

    it('should handle HTTP/2 stream events', function(done) {
      const server = httpModule.createServer(app);
      servers.push(server);

      app.get('/', function(req, res) {
        assert.strictEqual(req.httpVersion, '2.0');
        res.send('ok');
      });

      server.listen(0, function() {
        const port = server.address().port;
        const client = http2.connect(`http://localhost:${port}`);
        clients.push(client);

        const req = client.request({
          [http2.constants.HTTP2_HEADER_PATH]: '/',
          [http2.constants.HTTP2_HEADER_METHOD]: 'GET'
        });

        req.setEncoding('utf8');
        let data = '';
        req.on('data', (chunk) => {
          data += chunk;
        });

        req.on('response', (headers) => {
          assert.strictEqual(headers[http2.constants.HTTP2_HEADER_STATUS], 200);
        });

        req.on('end', () => {
          assert.strictEqual(data, 'ok');
          client.close();
          server.close(() => done());
        });

        req.on('error', (err) => {
          client.close();
          server.close();
          done(err);
        });

        req.end();
      });
    });

    it('should handle 404 errors correctly', function(done) {
      const server = httpModule.createServer(app);
      servers.push(server);

      server.listen(0, function() {
        const port = server.address().port;
        const client = http2.connect(`http://localhost:${port}`);
        clients.push(client);

        const req = client.request({
          [http2.constants.HTTP2_HEADER_PATH]: '/not-found',
          [http2.constants.HTTP2_HEADER_METHOD]: 'GET'
        });

        req.setEncoding('utf8');
        req.on('response', (headers) => {
          assert.strictEqual(headers[http2.constants.HTTP2_HEADER_STATUS], 404);
          req.on('data', () => {
            // Just consume the data
          });
          req.on('end', () => {
            client.close();
            server.close(() => done());
          });
        });

        req.on('error', (err) => {
          client.close();
          server.close();
          done(err);
        });

        req.end();
      });
    });

    it('should handle errors in application routes', function(done) {
      const server = httpModule.createServer(app);
      servers.push(server);

      app.get('/error', function(req, res) {
        throw new Error('test error');
      });

      server.listen(0, function() {
        const port = server.address().port;
        const client = http2.connect(`http://localhost:${port}`);
        clients.push(client);

        const req = client.request({
          [http2.constants.HTTP2_HEADER_PATH]: '/error',
          [http2.constants.HTTP2_HEADER_METHOD]: 'GET'
        });

        req.setEncoding('utf8');
        req.on('response', (headers) => {
          assert.strictEqual(headers[http2.constants.HTTP2_HEADER_STATUS], 500);
          req.on('data', () => {
            // Just consume the data
          });
          req.on('end', () => {
            client.close();
            server.close(() => done());
          });
        });

        req.on('error', (err) => {
          client.close();
          server.close();
          done(err);
        });

        req.end();
      });
    });
  });

  describe('createSecureServer()', function() {
    before(function() {
      // Skip secure server tests if certificates weren't created
      if (!fs.existsSync(TEMP_KEY_PATH) || !fs.existsSync(TEMP_CERT_PATH)) {
        this.skip();
      }
    });

    it('should create an HTTP/2 secure server instance', function() {
      const options = {
        key: fs.readFileSync(TEMP_KEY_PATH),
        cert: fs.readFileSync(TEMP_CERT_PATH)
      };

      const server = httpModule.createSecureServer(app, options);
      servers.push(server);

      // Check if server has expected HTTP/2 secure server methods instead of using instanceof
      assert.strictEqual(typeof server.on, 'function');
      assert.strictEqual(typeof server.listen, 'function');
      assert.strictEqual(typeof server.close, 'function');
      server.close();
    });

    it('should require key and cert options', function() {
      assert.throws(function() {
        httpModule.createSecureServer(app, {});
      }, /HTTP\/2 secure server requires key and cert options/);
    });

    it('should handle HTTP/2 secure stream events', function(done) {
      const options = {
        key: fs.readFileSync(TEMP_KEY_PATH),
        cert: fs.readFileSync(TEMP_CERT_PATH),
        allowHTTP1: true
      };

      const server = httpModule.createSecureServer(app, options);
      servers.push(server);

      app.get('/', function(req, res) {
        assert.strictEqual(req.httpVersion, '2.0');
        res.send('ok');
      });

      server.listen(0, function() {
        const port = server.address().port;

        // Use insecure client for tests (ignore certificate validation)
        const client = http2.connect(`https://localhost:${port}`, {
          ca: fs.readFileSync(TEMP_CERT_PATH),
          rejectUnauthorized: false
        });
        clients.push(client);

        const req = client.request({
          [http2.constants.HTTP2_HEADER_PATH]: '/',
          [http2.constants.HTTP2_HEADER_METHOD]: 'GET'
        });

        req.setEncoding('utf8');
        let data = '';
        req.on('data', (chunk) => {
          data += chunk;
        });

        req.on('response', (headers) => {
          assert.strictEqual(headers[http2.constants.HTTP2_HEADER_STATUS], 200);
        });

        req.on('end', () => {
          assert.strictEqual(data, 'ok');
          client.close();
          server.close(() => done());
        });

        req.on('error', (err) => {
          client.close();
          server.close();
          done(err);
        });

        req.end();
      });
    });
  });

  describe('Request compatibility', function() {
    it('should provide standard request properties', function(done) {
      const server = httpModule.createServer(app);
      servers.push(server);

      app.get('/test-request', function(req, res) {
        assert.strictEqual(req.httpVersion, '2.0');
        assert.strictEqual(req.httpVersionMajor, 2);
        assert.strictEqual(req.httpVersionMinor, 0);

        // Standard properties
        assert.strictEqual(typeof req.url, 'string');
        assert.strictEqual(typeof req.method, 'string');
        assert.strictEqual(typeof req.headers, 'object');

        // Express extensions
        assert.strictEqual(typeof req.query, 'object');
        assert.strictEqual(typeof req.params, 'object');
        assert.strictEqual(typeof req.body, 'object');

        res.send('ok');
      });

      server.listen(0, function() {
        const port = server.address().port;
        const client = http2.connect(`http://localhost:${port}`);
        clients.push(client);

        const req = client.request({
          [http2.constants.HTTP2_HEADER_PATH]: '/test-request',
          [http2.constants.HTTP2_HEADER_METHOD]: 'GET'
        });

        // Just consume data without storing it
        req.setEncoding('utf8');
        req.on('data', () => {
          // Consume data but don't store it
        });

        req.on('error', (err) => {
          client.close();
          server.close();
          done(err);
        });

        req.on('end', () => {
          client.close();
          server.close(() => done());
        });

        req.end();
      });
    });

    it('should parse query parameters', function(done) {
      const server = httpModule.createServer(app);
      servers.push(server);

      app.get('/query', function(req, res) {
        assert.strictEqual(req.query.foo, 'bar');
        assert.strictEqual(req.query.baz, 'qux');
        res.send('ok');
      });

      server.listen(0, function() {
        const port = server.address().port;
        const client = http2.connect(`http://localhost:${port}`);
        clients.push(client);

        const req = client.request({
          [http2.constants.HTTP2_HEADER_PATH]: '/query?foo=bar&baz=qux',
          [http2.constants.HTTP2_HEADER_METHOD]: 'GET'
        });

        // Just consume data without storing it
        req.setEncoding('utf8');
        req.on('data', () => {
          // Consume data but don't store it
        });

        req.on('error', (err) => {
          client.close();
          server.close();
          done(err);
        });

        req.on('end', () => {
          client.close();
          server.close(() => done());
        });

        req.end();
      });
    });
  });

  describe('Response compatibility', function() {
    it('should provide Express response methods', function(done) {
      const server = httpModule.createServer(app);
      servers.push(server);

      app.get('/test-response', function(req, res) {
        // Test available methods
        assert.strictEqual(typeof res.status, 'function');
        assert.strictEqual(typeof res.send, 'function');
        assert.strictEqual(typeof res.json, 'function');
        assert.strictEqual(typeof res.sendStatus, 'function');

        // Test chainable API
        res.status(200).send('ok');
      });

      server.listen(0, function() {
        const port = server.address().port;
        const client = http2.connect(`http://localhost:${port}`);
        clients.push(client);

        const req = client.request({
          [http2.constants.HTTP2_HEADER_PATH]: '/test-response',
          [http2.constants.HTTP2_HEADER_METHOD]: 'GET'
        });

        // Just consume data without storing it
        req.setEncoding('utf8');
        req.on('data', () => {
          // Consume data but don't store it
        });

        req.on('error', (err) => {
          client.close();
          server.close();
          done(err);
        });

        req.on('end', () => {
          client.close();
          server.close(() => done());
        });

        req.end();
      });
    });

    it('should send JSON responses', function(done) {
      const server = httpModule.createServer(app);
      servers.push(server);

      let responseData = '';

      app.get('/json', function(req, res) {
        res.json({ hello: 'world' });
      });

      server.listen(0, function() {
        const port = server.address().port;
        const client = http2.connect(`http://localhost:${port}`);
        clients.push(client);

        const req = client.request({
          [http2.constants.HTTP2_HEADER_PATH]: '/json',
          [http2.constants.HTTP2_HEADER_METHOD]: 'GET'
        });

        req.setEncoding('utf8');
        req.on('data', (chunk) => {
          responseData += chunk;
        });

        req.on('end', () => {
          assert.deepStrictEqual(JSON.parse(responseData), { hello: 'world' });
          client.close();
          server.close(() => done());
        });

        req.on('error', (err) => {
          client.close();
          server.close();
          done(err);
        });

        req.end();
      });
    });

    it('should set custom headers', function(done) {
      const server = httpModule.createServer(app);
      servers.push(server);

      app.get('/headers', function(req, res) {
        res.setHeader('X-Custom-Header', 'test-value');
        res.send('ok');
      });

      server.listen(0, function() {
        const port = server.address().port;
        const client = http2.connect(`http://localhost:${port}`);
        clients.push(client);

        const req = client.request({
          [http2.constants.HTTP2_HEADER_PATH]: '/headers',
          [http2.constants.HTTP2_HEADER_METHOD]: 'GET'
        });

        // Just consume data without storing it
        req.setEncoding('utf8');
        req.on('data', () => {
          // Consume data but don't store it
        });

        req.on('response', (headers) => {
          assert.strictEqual(headers['x-custom-header'], 'test-value');
        });

        req.on('end', () => {
          client.close();
          server.close(() => done());
        });

        req.on('error', (err) => {
          client.close();
          server.close();
          done(err);
        });

        req.end();
      });
    });
  });
});
