'use strict';

/**
 * Module dependencies.
 */

const assert = require('node:assert');
const http2 = require('node:http2');
const fs = require('node:fs');
const path = require('node:path');
const express = require('..');
const os = require('node:os');

/**
 * Temporary certificate paths for tests
 */
const TEMP_KEY_PATH = path.join(os.tmpdir(), 'express-test-key.pem');
const TEMP_CERT_PATH = path.join(os.tmpdir(), 'express-test-cert.pem');

describe('Express.js HTTP/2 Integration', function() {
  // Increase test timeout
  this.timeout(5000);

  // Track all servers and clients to ensure proper cleanup
  let servers = [];
  let clients = [];

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

  // Reset servers and clients arrays after each test
  afterEach(function() {
    servers = [];
    clients = [];
  });

  describe('app.http2()', function() {
    it('should expose HTTP/2 server creation method', function() {
      const app = express();
      assert.strictEqual(typeof app.http2, 'function');
    });

    it('should create an HTTP/2 server for an Express app', function() {
      const app = express();
      const server = app.http2(app, {});
      servers.push(server);

      // Check for HTTP/2 server properties instead of using instanceof
      assert.strictEqual(typeof server.on, 'function');
      assert.strictEqual(typeof server.listen, 'function');
      assert.strictEqual(typeof server.close, 'function');

      server.close();
    });

    it('should handle requests through the Express app', function(done) {
      const app = express();

      app.get('/', function(req, res) {
        res.send('HTTP/2 test');
      });

      const server = app.http2(app, {});
      servers.push(server);

      server.listen(0, function() {
        const port = server.address().port;
        const client = http2.connect(`http://localhost:${port}`);
        clients.push(client);

        let data = '';
        const req = client.request({
          [http2.constants.HTTP2_HEADER_PATH]: '/',
          [http2.constants.HTTP2_HEADER_METHOD]: 'GET'
        });

        req.setEncoding('utf8');
        req.on('data', (chunk) => {
          data += chunk;
        });

        req.on('end', () => {
          assert.strictEqual(data, 'HTTP/2 test');
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

    it('should correctly use Express middleware stack', function(done) {
      const app = express();

      // Add middleware
      app.use(function(req, res, next) {
        req.custom = 'middleware test';
        next();
      });

      app.get('/middleware', function(req, res) {
        res.send(req.custom);
      });

      const server = app.http2(app, {});
      servers.push(server);

      server.listen(0, function() {
        const port = server.address().port;
        const client = http2.connect(`http://localhost:${port}`);
        clients.push(client);

        let data = '';
        const req = client.request({
          [http2.constants.HTTP2_HEADER_PATH]: '/middleware',
          [http2.constants.HTTP2_HEADER_METHOD]: 'GET'
        });

        req.setEncoding('utf8');
        req.on('data', (chunk) => {
          data += chunk;
        });

        req.on('end', () => {
          assert.strictEqual(data, 'middleware test');
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

  describe('app.http2Secure()', function() {
    before(function() {
      // Skip secure server tests if certificates weren't created
      if (!fs.existsSync(TEMP_KEY_PATH) || !fs.existsSync(TEMP_CERT_PATH)) {
        this.skip();
      }
    });

    it('should expose HTTP/2 secure server creation method', function() {
      const app = express();
      assert.strictEqual(typeof app.http2Secure, 'function');
    });

    it('should create an HTTP/2 secure server for an Express app', function() {
      const app = express();
      const options = {
        key: fs.readFileSync(TEMP_KEY_PATH),
        cert: fs.readFileSync(TEMP_CERT_PATH)
      };

      const server = app.http2Secure(app, options);
      servers.push(server);

      // Check for HTTP/2 secure server properties instead of using instanceof
      assert.strictEqual(typeof server.on, 'function');
      assert.strictEqual(typeof server.listen, 'function');
      assert.strictEqual(typeof server.close, 'function');

      server.close();
    });

    it('should handle secure requests through the Express app', function(done) {
      const app = express();

      app.get('/secure', function(req, res) {
        res.send('HTTP/2 secure test');
      });

      const options = {
        key: fs.readFileSync(TEMP_KEY_PATH),
        cert: fs.readFileSync(TEMP_CERT_PATH)
      };

      const server = app.http2Secure(app, options);
      servers.push(server);

      server.listen(0, function() {
        const port = server.address().port;

        // Use insecure client for tests (ignore certificate validation)
        const client = http2.connect(`https://localhost:${port}`, {
          ca: fs.readFileSync(TEMP_CERT_PATH),
          rejectUnauthorized: false
        });
        clients.push(client);

        let data = '';
        const req = client.request({
          [http2.constants.HTTP2_HEADER_PATH]: '/secure',
          [http2.constants.HTTP2_HEADER_METHOD]: 'GET'
        });

        req.setEncoding('utf8');
        req.on('data', (chunk) => {
          data += chunk;
        });

        req.on('end', () => {
          assert.strictEqual(data, 'HTTP/2 secure test');
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

    it('should correctly handle streaming responses', function(done) {
      const app = express();

      app.get('/stream', function(req, res) {
        // HTTP/2 streaming response
        res.write('part1,');

        setTimeout(() => {
          res.write('part2,');

          setTimeout(() => {
            res.write('part3');
            res.end();
          }, 50);
        }, 50);
      });

      const options = {
        key: fs.readFileSync(TEMP_KEY_PATH),
        cert: fs.readFileSync(TEMP_CERT_PATH)
      };

      const server = app.http2Secure(app, options);
      servers.push(server);

      server.listen(0, function() {
        const port = server.address().port;

        // Use insecure client for tests (ignore certificate validation)
        const client = http2.connect(`https://localhost:${port}`, {
          ca: fs.readFileSync(TEMP_CERT_PATH),
          rejectUnauthorized: false
        });
        clients.push(client);

        let data = '';
        const req = client.request({
          [http2.constants.HTTP2_HEADER_PATH]: '/stream',
          [http2.constants.HTTP2_HEADER_METHOD]: 'GET'
        });

        req.setEncoding('utf8');
        req.on('data', (chunk) => {
          data += chunk;
        });

        req.on('end', () => {
          assert.strictEqual(data, 'part1,part2,part3');
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

  describe('exports.http2', function() {
    it('should expose HTTP/2 module as an export', function() {
      assert.ok(express.http2);
      assert.strictEqual(typeof express.http2.createServer, 'function');
      assert.strictEqual(typeof express.http2.createSecureServer, 'function');
    });
  });
});
