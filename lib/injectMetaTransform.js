"use strict";

const { Transform } = require("node:stream");

class InjectMetaTransform extends Transform {
  constructor(metaHtml) {
    super();
    this.metaHtml = metaHtml || "";
    this.buffer = "";
    this.injected = false;
  }

  _transform(chunk, encoding, callback) {
    if (this.injected) {
      this.push(chunk);
      return callback();
    }

    this.buffer += chunk.toString("utf8");

    const idx = this.buffer.indexOf("</head>");
    if (idx !== -1) {
      const before = this.buffer.slice(0, idx);
      const after = this.buffer.slice(idx);
      this.push(before + this.metaHtml + after);
      this.injected = true;
      this.buffer = null;
      return callback();
    }

    // keep buffer bounded to avoid OOM on malformed HTML
    if (this.buffer.length > 128 * 1024) {
      this.push(this.buffer);
      this.buffer = "";
    }

    callback();
  }

  _flush(callback) {
    if (!this.injected && this.buffer) this.push(this.buffer);
    callback();
  }
}

module.exports = InjectMetaTransform;
