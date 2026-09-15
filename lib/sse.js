'use strict';

/**
 * Module dependencies.
 * @private
 */

var debug = require('debug')('express:sse');
var onFinished = require('on-finished');
var Readable = require('node:stream').Readable;
const { Buffer } = require('node:buffer');

/**
 * Module variables.
 * @private
 */

var DEFAULT_HEARTBEAT = 15000;

/**
 * Module exports.
 * @public
 */

module.exports = SSE;

/**
 * Initialize a new Server-Sent Events stream on the given response.
 *
 * Opens the stream by writing the `text/event-stream` headers and starts a
 * heartbeat that keeps the connection (and any intermediary proxies) alive.
 * The heartbeat is cleared automatically once the connection ends.
 *
 * Options:
 *
 *   - `heartbeat` interval in ms for keep-alive comments (default `15000`,
 *     `false` to disable)
 *
 * @param {http.ServerResponse} res
 * @param {object} [options]
 * @public
 */

function SSE(res, options) {
  var opts = options || {};
  var self = this;

  this.res = res;
  this.finished = false;
  this._heartbeat = null;

  debug('open stream');

  // open the event stream
  res.statusCode = 200;
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });

  // flush the headers so the client establishes the connection immediately
  res.flushHeaders();

  // keep the connection alive with periodic comments
  var heartbeat = opts.heartbeat === undefined ? DEFAULT_HEARTBEAT : opts.heartbeat;

  if (heartbeat) {
    this._heartbeat = setInterval(function onHeartbeat() {
      self.comment('');
    }, heartbeat);

    // do not let the heartbeat keep the process alive on its own
    this._heartbeat.unref();
  }

  // stop the heartbeat once the underlying connection is gone
  onFinished(res, function onClose() {
    debug('close stream');
    self.finished = true;
    self._clearHeartbeat();
  });
}

/**
 * Send an event with the given `data`.
 *
 * `data` is serialized the same way the rest of the framework serializes a
 * response body: strings are sent as-is, `Buffer`/`TypedArray` are decoded as
 * UTF-8 text, objects are `JSON.stringify`'d and everything else is coerced
 * with `String()`. Multi-line payloads are split into multiple `data:` lines
 * as required by the protocol.
 *
 * Options:
 *
 *   - `event` the event name (`event:` field)
 *   - `id` the event id (`id:` field)
 *   - `retry` the client reconnection time in ms (`retry:` field)
 *
 * @param {*} data
 * @param {object} [options]
 * @return {SSE} for chaining
 * @public
 */

SSE.prototype.send = function send(data, options) {
  var opts = options || {};
  var frame = '';

  if (opts.id != null) frame += 'id: ' + opts.id + '\n';
  if (opts.event != null) frame += 'event: ' + opts.event + '\n';
  if (opts.retry != null) frame += 'retry: ' + opts.retry + '\n';

  // a payload may span multiple lines, each needs its own `data:` field
  var lines = format(data).split('\n');
  for (var i = 0; i < lines.length; i++) {
    frame += 'data: ' + lines[i] + '\n';
  }

  return this._write(frame + '\n');
};

/**
 * Stream a source, emitting one event per chunk, and resolve when it ends.
 *
 * Any stream-like source is accepted by bridging it into a Node `Readable`:
 * a web `ReadableStream` or `Blob` via `Readable.fromWeb()`, and Node streams
 * or async iterables directly. Each chunk is passed through `send()`, so the
 * same serialization and `options` apply.
 *
 * @param {ReadableStream|Readable|Blob|AsyncIterable|Iterable} source
 * @param {object} [options]
 * @return {Promise<SSE>} resolves with the stream when the source ends
 * @public
 */

SSE.prototype.stream = async function stream(source, options) {
  var readable = toReadable(source);

  for await (var chunk of readable) {
    if (this.finished) break;
    this.send(chunk, options);
  }

  return this;
};

/**
 * Write a comment line, used as a keep-alive that does not trigger `onmessage`.
 *
 * @param {string} [text]
 * @return {SSE} for chaining
 * @public
 */

SSE.prototype.comment = function comment(text) {
  return this._write(': ' + (text == null ? '' : text) + '\n\n');
};

/**
 * Close the stream and stop the heartbeat.
 *
 * @return {SSE} for chaining
 * @public
 */

SSE.prototype.close = function close() {
  this._clearHeartbeat();

  if (!this.finished) {
    this.finished = true;
    this.res.end();
  }

  return this;
};

/**
 * Write a raw chunk if the connection is still open.
 *
 * @param {string} chunk
 * @return {SSE} for chaining
 * @private
 */

SSE.prototype._write = function _write(chunk) {
  if (!this.finished) {
    this.res.write(chunk);
  }

  return this;
};

/**
 * Clear the heartbeat interval if one is running.
 *
 * @private
 */

SSE.prototype._clearHeartbeat = function _clearHeartbeat() {
  if (this._heartbeat) {
    clearInterval(this._heartbeat);
    this._heartbeat = null;
  }
};

/**
 * Serialize a value to the text payload of a `data:` field.
 *
 * @param {*} data
 * @return {string}
 * @private
 */

function format(data) {
  if (data == null) {
    return '';
  }

  if (ArrayBuffer.isView(data)) {
    return Buffer.from(data.buffer, data.byteOffset, data.byteLength).toString('utf8');
  }

  if (typeof data === 'object') {
    return JSON.stringify(data);
  }

  return String(data);
}

/**
 * Bridge any stream-like source into a Node `Readable`.
 *
 * @param {ReadableStream|Readable|Blob|AsyncIterable|Iterable} source
 * @return {Readable}
 * @private
 */

function toReadable(source) {
  if (source instanceof Readable) {
    return source;
  }

  if (typeof ReadableStream !== 'undefined' && source instanceof ReadableStream) {
    return Readable.fromWeb(source);
  }

  if (typeof Blob !== 'undefined' && source instanceof Blob) {
    return Readable.fromWeb(source.stream());
  }

  return Readable.from(source);
}
