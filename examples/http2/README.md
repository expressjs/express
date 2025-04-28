# HTTP/2 Support

This directory contains an example demonstrating HTTP/2 support in Express.

## What is HTTP/2?

HTTP/2 is the second major version of the HTTP protocol. It offers several advantages over HTTP/1.1:

- Multiplexing: Multiple requests can be sent over a single connection
- Header compression: Reduces overhead and improves performance
- Server push: Allows the server to proactively send resources to the client
- Binary format: More efficient to parse than HTTP/1.1's text format

## Prerequisites

- Node.js (version 8.4.0 or higher)
- OpenSSL (for generating certificates)

## Running the example

1. Generate self-signed certificates:

```bash
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout private-key.pem -out certificate.pem
```

2. Run the example:

```bash
node http2.js
```

3. Visit https://localhost:3000 in your browser

**Note:** Your browser may show a security warning because of the self-signed certificate. This is expected and you can proceed by accepting the risk.

## How it works

The `http2.js` file demonstrates:
- Creating an HTTP/2 server with Express
- Setting up secure connections with TLS certificates
- Serving content through the HTTP/2 protocol

For more information about HTTP/2 support in Node.js, visit the [official documentation](https://nodejs.org/api/http2.html).
