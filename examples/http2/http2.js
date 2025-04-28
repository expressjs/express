'use strict';

/**
 * Example application showcasing Express with HTTP/2 support
 *
 * Note: To run this example, you need to generate self-signed certificates first:
 *
 * $ openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
 *   -keyout examples/http2/private-key.pem \
 *   -out examples/http2/certificate.pem
 */

const express = require('../..');
const fs = require('node:fs');
const path = require('node:path');
const app = express();

// ---------------
// BASIC ROUTES
// ---------------

app.get('/', (req, res) => {
  res.json({
    message: 'Express with HTTP/2 support',
    protocol: req.httpVersion === '2.0' ? 'HTTP/2' : 'HTTP/1.1',
    method: req.method,
    url: req.url
  });
});

app.get('/stream', (req, res) => {
  // HTTP/2 streaming example
  res.write(JSON.stringify({ message: 'This is the first part' }) + '\n');

  setTimeout(() => {
    res.write(JSON.stringify({ message: 'This is the second part' }) + '\n');

    setTimeout(() => {
      res.write(JSON.stringify({ message: 'This is the final part' }) + '\n');
      res.end();
    }, 1000);
  }, 1000);
});

// Try to load certificates for HTTP/2 HTTPS
let server;
try {
  const options = {
    key: fs.readFileSync(path.join(__dirname, 'private-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certificate.pem')),
    allowHTTP1: true  // Allow HTTP/1.1 fallback
  };

  // Create HTTP/2 secure server
  server = app.http2Secure(app, options);

  server.listen(3000, () => {
    console.log('Express HTTP/2 server running on https://localhost:3000');
    console.log('Note: Since this uses a self-signed certificate, your browser may show a security warning');
  });
} catch (err) {
  console.error('Could not load certificates for HTTPS:', err.message);
  console.log('Falling back to plain HTTP/2...');

  // Create plain HTTP/2 server
  server = app.http2(app, {});

  server.listen(3000, () => {
    console.log('Express HTTP/2 server running on http://localhost:3000');
    console.log('Note: Some browsers only support HTTP/2 over HTTPS');
  });
}
