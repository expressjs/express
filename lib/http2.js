/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

var http2 = require('node:http2');
var debug = require('debug')('express:http2');

/**
 * HTTP/2 constants
 */
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE
} = http2.constants;

/**
 * Create an HTTP/2 server for an Express app
 *
 * @param {Object} app Express application
 * @param {Object} options HTTP/2 server options
 * @return {Object} HTTP/2 server instance
 * @public
 */
exports.createServer = function createServer(app, options) {
  debug('Creating HTTP/2 server');

  // Create the HTTP/2 server
  const server = http2.createServer(options);

  // Handle HTTP/2 streams
  server.on('stream', (stream, headers) => {
    debug('Received HTTP/2 stream');

    // Create mock request and response objects compatible with Express
    const req = createRequest(stream, headers);
    const res = createResponse(stream);

    // Set req and res references to each other
    req.res = res;
    res.req = req;

    // Set app as req.app and res.app
    req.app = res.app = app;

    // Create a custom finalhandler that works with HTTP/2
    const done = function(err) {
      if (err && !stream.destroyed) {
        const statusCode = err.status || err.statusCode || 500;
        stream.respond({
          [HTTP2_HEADER_STATUS]: statusCode,
          [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain',
        });
        stream.end(statusCode === 500 ? 'Internal Server Error' : err.message);
      } else if (!res.headersSent && !stream.destroyed) {
        // Default 404 handler
        stream.respond({
          [HTTP2_HEADER_STATUS]: 404,
          [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain',
        });
        stream.end('Not Found');
      }
    };

    // Handle the request with Express
    app(req, res, done);
  });

  return server;
};

/**
 * Create an HTTP/2 secure server for an Express app
 *
 * @param {Object} app Express application
 * @param {Object} options HTTP/2 secure server options
 * @return {Object} HTTP/2 secure server instance
 * @public
 */
exports.createSecureServer = function createSecureServer(app, options) {
  debug('Creating HTTP/2 secure server');

  if (!options.key || !options.cert) {
    throw new Error('HTTP/2 secure server requires key and cert options');
  }

  // Create the HTTP/2 secure server
  const server = http2.createSecureServer(options);

  // Handle HTTP/2 streams
  server.on('stream', (stream, headers) => {
    debug('Received HTTP/2 secure stream');

    // Create mock request and response objects compatible with Express
    const req = createRequest(stream, headers);
    const res = createResponse(stream);

    // Set req and res references to each other
    req.res = res;
    res.req = req;

    // Set app as req.app and res.app
    req.app = res.app = app;

    // Create a custom finalhandler that works with HTTP/2
    const done = function(err) {
      if (err && !stream.destroyed) {
        const statusCode = err.status || err.statusCode || 500;
        stream.respond({
          [HTTP2_HEADER_STATUS]: statusCode,
          [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain',
        });
        stream.end(statusCode === 500 ? 'Internal Server Error' : err.message);
      } else if (!res.headersSent && !stream.destroyed) {
        // Default 404 handler
        stream.respond({
          [HTTP2_HEADER_STATUS]: 404,
          [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain',
        });
        stream.end('Not Found');
      }
    };

    // Handle the request with Express
    app(req, res, done);
  });

  return server;
};

/**
 * Create a mock request object compatible with Express
 *
 * @param {Object} stream HTTP/2 stream
 * @param {Object} headers HTTP/2 headers
 * @return {Object} Express-compatible request object
 * @private
 */
function createRequest(stream, headers) {
  const method = headers[HTTP2_HEADER_METHOD] || 'GET';
  const url = headers[HTTP2_HEADER_PATH] || '/';

  debug(`HTTP/2 ${method} ${url}`);

  // Create basic request object
  const req = {
    stream: stream,
    httpVersionMajor: 2,
    httpVersionMinor: 0,
    httpVersion: '2.0',
    complete: false,
    headers: Object.assign({}, headers),
    rawHeaders: [],
    trailers: {},
    rawTrailers: [],
    aborted: false,
    upgrade: false,
    url: url,
    method: method,
    statusCode: null,
    statusMessage: null,
    socket: stream.session.socket,
    connection: stream.session.socket,

    // Body parsing
    body: {},

    // Express extensions
    params: {},
    query: {},
    res: null,

    // Properties needed by finalhandler
    _readableState: { pipes: null },
    unpipe: function() { return this; },
    removeListener: function() { return this; },

    // Stream-like methods
    on: stream.on.bind(stream),
    once: stream.once.bind(stream),
    pipe: function() { return this; },
    addListener: function(type, listener) {
      stream.on(type, listener);
      return this;
    },
    removeAllListeners: function() {
      return this;
    },
    emit: stream.emit.bind(stream),
    setEncoding: function(encoding) {
      stream.setEncoding(encoding);
      return this;
    },
    pause: function() {
      stream.pause && stream.pause();
      return this;
    },
    resume: function() {
      stream.resume && stream.resume();
      return this;
    },

    // Request reading methods
    read: stream.read ? stream.read.bind(stream) : () => null,
  };

  // Parse URL parts
  parseUrl(req);

  // Add data event handling
  const chunks = [];

  stream.on('data', chunk => {
    chunks.push(chunk);
  });

  stream.on('end', () => {
    req.complete = true;
    req.rawBody = Buffer.concat(chunks);

    // Try to parse as JSON if content-type is application/json
    if (req.headers['content-type'] === 'application/json') {
      try {
        req.body = JSON.parse(req.rawBody.toString());
      } catch (e) {
        debug('Failed to parse request body as JSON', e);
      }
    }
  });

  return req;
}

/**
 * Create a mock response object compatible with Express
 *
 * @param {Object} stream HTTP/2 stream
 * @return {Object} Express-compatible response object
 * @private
 */
function createResponse(stream) {
  const res = {
    stream: stream,
    headersSent: false,
    finished: false,
    statusCode: 200,
    locals: Object.create(null),
    req: null,

    // Properties needed by finalhandler
    _header: '',
    _implicitHeader: function() {},
    connection: { writable: true },

    // Response methods
    status: function(code) {
      this.statusCode = code;
      return this;
    },

    send: function(body) {
      if (this.headersSent) {
        debug('Headers already sent, ignoring send');
        return this;
      }

      if (!this.getHeader('Content-Type')) {
        if (typeof body === 'string') {
          this.setHeader('Content-Type', 'text/html');
        } else if (Buffer.isBuffer(body)) {
          this.setHeader('Content-Type', 'application/octet-stream');
        } else if (typeof body === 'object') {
          this.setHeader('Content-Type', 'application/json');
          body = JSON.stringify(body);
        }
      }

      const headers = {
        [HTTP2_HEADER_STATUS]: this.statusCode,
      };

      // Convert traditional headers to HTTP/2 headers
      for (const name in this._headers) {
        headers[name.toLowerCase()] = this._headers[name];
      }

      stream.respond(headers);
      this.headersSent = true;

      if (body !== undefined) {
        stream.end(body);
        this.finished = true;
      }

      return this;
    },

    json: function(obj) {
      if (!this.getHeader('Content-Type')) {
        this.setHeader('Content-Type', 'application/json');
      }

      return this.send(JSON.stringify(obj));
    },

    sendStatus: function(code) {
      const status = code.toString();
      this.statusCode = code;
      return this.send(status);
    },

    // Response streaming methods
    write: function(data, encoding) {
      if (!this.headersSent) {
        const headers = {
          [HTTP2_HEADER_STATUS]: this.statusCode,
        };

        // Convert traditional headers to HTTP/2 headers
        for (const name in this._headers) {
          headers[name.toLowerCase()] = this._headers[name];
        }

        stream.respond(headers);
        this.headersSent = true;
      }

      return stream.write(data, encoding);
    },

    // Headers management
    _headers: {},
    getHeaders: function() {
      return Object.assign({}, this._headers);
    },

    setHeader: function(name, value) {
      this._headers[name] = value;
      return this;
    },

    getHeader: function(name) {
      return this._headers[name];
    },

    removeHeader: function(name) {
      delete this._headers[name];
      return this;
    },

    end: function(data) {
      if (this.finished) {
        debug('Response already finished, ignoring end');
        return this;
      }

      if (!this.headersSent) {
        const headers = {
          [HTTP2_HEADER_STATUS]: this.statusCode,
        };

        // Convert traditional headers to HTTP/2 headers
        for (const name in this._headers) {
          headers[name.toLowerCase()] = this._headers[name];
        }

        stream.respond(headers);
        this.headersSent = true;
      }

      stream.end(data);
      this.finished = true;
      return this;
    }
  };

  return res;
}

/**
 * Parse URL parts from request
 *
 * @param {Object} req Request object
 * @private
 */
function parseUrl(req) {
  const url = new URL(req.url, 'http://localhost');

  req.path = url.pathname;
  req.hostname = url.hostname;

  // Parse query string
  req.query = {};
  for (const [key, value] of url.searchParams.entries()) {
    req.query[key] = value;
  }
}
