/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

//  解析HTTP请求报文的body内容，在POST、HEAD等HTTP操作动词使用
var bodyParser = require("body-parser");

// 基于node内置的事件模块
var EventEmitter = require("events").EventEmitter;

// 从源对象到目标对象的属性合并
var mixin = require("merge-descriptors");
var proto = require("./application");

// 区分Router和Route，Router表示一种路由的上下文容器，而Route表示路由匹配规则
var Route = require("./router/route");
var Router = require("./router");

// HTTP模块最重要的两个组成，用于处理请求报文和响应报文
var req = require("./request");
var res = require("./response");

/**
 * Expose `createApplication()`.
 */

exports = module.exports = createApplication;

/**
 * Create an express application.
 *
 * @return {Function}
 * @api public
 */

function createApplication() {
  var app = function(req, res, next) {
    // 处理路由逻辑
    app.handle(req, res, next);
  };

  // 这部分是增强app能力的核心
  mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);

  // expose the prototype that will get set on requests
  app.request = Object.create(req, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  });

  // expose the prototype that will get set on responses
  app.response = Object.create(res, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  });

  app.init();
  return app;
}

/**
 * Expose the prototypes.
 */

exports.application = proto;
exports.request = req;
exports.response = res;

/**
 * Expose constructors.
 */

exports.Route = Route;
exports.Router = Router;

/**
 * Expose middleware
 */

exports.json = bodyParser.json;

// 挂载中间件
exports.query = require("./middleware/query");
exports.static = require("serve-static");
exports.urlencoded = bodyParser.urlencoded;

// 为了保持express的最小核心，下面的中间件已经被移除。因此开发者需要自行安装引入，否则报错
var removedMiddlewares = [
  "bodyParser",
  "compress",
  "cookieSession",
  "session",
  "logger",
  "cookieParser",
  "favicon",
  "responseTime",
  "errorHandler",
  "timeout",
  "methodOverride",
  "vhost",
  "csrf",
  "directory",
  "limit",
  "multipart",
  "staticCache"
];

removedMiddlewares.forEach(function(name) {
  Object.defineProperty(exports, name, {
    get: function() {
      throw new Error(
        "Most middleware (like " +
          name +
          ") is no longer bundled with Express and must be installed separately. Please see https://github.com/senchalabs/connect#middleware."
      );
    },
    configurable: true
  });
});
