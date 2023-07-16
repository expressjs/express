import accepts from "accepts";
import deprecate from "depd";
import { isIP } from "net";
import typeis from "type-is";
import http from "http";
import fresh from "fresh";
import parseRange from "range-parser";
import parse from "parseurl";
import proxyaddr from "proxy-addr";

const deprecateReq = deprecate("express");

class Request extends http.IncomingMessage {
  constructor() {
    super();
  }

  get header() {
    throw new Error("Use req.headers instead.");
  }

  get(name) {
    if (!name) {
      throw new TypeError("name argument is required to req.get");
    }

    if (typeof name !== "string") {
      throw new TypeError("name must be a string to req.get");
    }

    const lc = name.toLowerCase();

    switch (lc) {
      case "referer":
      case "referrer":
        return this.headers.referrer || this.headers.referer;
      default:
        return this.headers[lc];
    }
  }

  accepts(...args) {
    const accept = accepts(this);
    return accept.types(...args);
  }

  acceptsEncodings(...args) {
    const accept = accepts(this);
    return accept.encodings(...args);
  }

  acceptsCharsets(...args) {
    const accept = accepts(this);
    return accept.charsets(...args);
  }

  acceptsLanguages(...args) {
    const accept = accepts(this);
    return accept.languages(...args);
  }

  range(size, options) {
    const range = this.get("Range");
    if (!range) return;
    return parseRange(size, range, options);
  }

  param(name, defaultValue) {
    const params = this.params || {};
    const body = this.body || {};
    const query = this.query || {};

    deprecateReq("req.param(): Use req.params, req.body, or req.query instead");

    if (params.hasOwnProperty(name)) return params[name];
    if (body.hasOwnProperty(name)) return body[name];
    if (query.hasOwnProperty(name)) return query[name];

    return defaultValue;
  }

  is(types) {
    const arr = Array.isArray(types) ? types : Array.from(arguments);
    return typeis(this, arr);
  }

  get protocol() {
    const proto = this.connection.encrypted ? "https" : "http";
    const trust = this.app.get("trust proxy fn");

    if (!trust(this.connection.remoteAddress, 0)) {
      return proto;
    }

    const header = this.get("X-Forwarded-Proto") || proto;
    const index = header.indexOf(",");

    return index !== -1 ? header.substring(0, index).trim() : header.trim();
  }

  get secure() {
    return this.protocol === "https";
  }

  get ip() {
    const trust = this.app.get("trust proxy fn");
    return proxyaddr(this, trust);
  }

  get ips() {
    const trust = this.app.get("trust proxy fn");
    const addrs = proxyaddr.all(this, trust);
    addrs.reverse().pop();
    return addrs;
  }

  get subdomains() {
    const hostname = this.hostname;
    if (!hostname) return [];
    const offset = this.app.get("subdomain offset");
    const subdomains = !isIP(hostname)
      ? hostname.split(".").reverse()
      : [hostname];
    return subdomains.slice(offset);
  }

  get path() {
    return parse(this).pathname;
  }

  get hostname() {
    const trust = this.app.get("trust proxy fn");
    let host = this.get("X-Forwarded-Host");

    if (!host || !trust(this.connection.remoteAddress, 0)) {
      host = this.get("Host");
    } else if (host.indexOf(",") !== -1) {
      host = host.substring(0, host.indexOf(",")).trimRight();
    }

    if (!host) return;

    const offset = host[0] === "[" ? host.indexOf("]") + 1 : 0;
    const index = host.indexOf(":", offset);

    return index !== -1 ? host.substring(0, index) : host;
  }

  get host() {
    return this.hostname;
  }

  get fresh() {
    const method = this.method;
    const res = this.res;
    const status = res.statusCode;

    if (method !== "GET" && method !== "HEAD") return false;

    if ((status >= 200 && status < 300) || status === 304) {
      return fresh(this.headers, {
        etag: res.get("ETag"),
        "last-modified": res.get("Last-Modified"),
      });
    }

    return false;
  }

  get stale() {
    return !this.fresh;
  }

  get xhr() {
    const val = this.get("X-Requested-With") || "";
    return val.toLowerCase() === "xmlhttprequest";
  }
}

export default Request;
