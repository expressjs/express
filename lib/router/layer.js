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
 * @private
 */

// 几乎所有路由模块都采用这个第三方依赖，其含义在于将运行时的页面路由进行正则化处理，然后与项目配置的路由表进行对比
var pathRegexp = require("path-to-regexp");
var debug = require("debug")("express:router:layer");

/**
 * Module variables.
 * @private
 */

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Module exports.
 * @public
 */

module.exports = Layer;

/**
 * 基于特定路径的处理函数
 * @param {*} path 应用在运行期的真实路径
 * @param {*} options 路径转正则的可选参数
 * @param {*} fn 匹配成功的处理函数
 */
function Layer(path, options, fn) {
  if (!(this instanceof Layer)) {
    return new Layer(path, options, fn);
  }

  debug("new %o", path);
  var opts = options || {};

  // 特定路由对应的处理函数
  this.handle = fn;
  this.name = fn.name || "<anonymous>";
  this.params = undefined;
  this.path = undefined;
  this.regexp = pathRegexp(path, (this.keys = []), opts);

  // set fast path flags
  this.regexp.fast_star = path === "*";
  this.regexp.fast_slash = path === "/" && opts.end === false;
}

/**
 * Handle the error for the layer.
 *
 * @param {Error} error
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @api private
 */

Layer.prototype.handle_error = function handle_error(error, req, res, next) {
  var fn = this.handle;

  // fn处理函数的形参不是4个，则传递下一个中间件处理
  if (fn.length !== 4) {
    return next(error);
  }

  try {
    // 标准的路由处理函数调用
    fn(error, req, res, next);
  } catch (err) {
    next(err);
  }
};

/**
 * Handle the request for the layer.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @api private
 */

Layer.prototype.handle_request = function handle(req, res, next) {
  var fn = this.handle;

  // 路由处理函数的参数大于3，则传递给下一个中间件处理
  if (fn.length > 3) {
    // not a standard request handler
    return next();
  }

  try {
    fn(req, res, next);
  } catch (err) {
    next(err);
  }
};

/**
 * Check if this route matches `path`, if so
 * populate `.params`.
 *
 * @param {String} path
 * @return {Boolean}
 * @api private
 */

//  路由比较过程，基于配置的路由表与当前真实路由path
Layer.prototype.match = function match(path) {
  var match;

  if (path != null) {
    // 下面表示匹配所有路由
    if (this.regexp.fast_slash) {
      this.params = {};
      this.path = "";
      return true;
    }

    //所有路由进行匹配，并解释真实path携带的参数
    if (this.regexp.fast_star) {
      this.params = { "0": decode_param(path) };
      this.path = path;
      return true;
    }

    // 真正执行路由对比操作
    match = this.regexp.exec(path);
  }

  // 如果没有匹配成功，则返回
  if (!match) {
    this.params = undefined;
    this.path = undefined;
    return false;
  }

  // store values
  this.params = {};
  this.path = match[0];

  var keys = this.keys;
  var params = this.params;

  // 匹配成功后，将真实path携带的参数都重新封装为params数组
  for (var i = 1; i < match.length; i++) {
    var key = keys[i - 1];
    var prop = key.name;
    var val = decode_param(match[i]);

    if (val !== undefined || !hasOwnProperty.call(params, prop)) {
      params[prop] = val;
    }
  }

  return true;
};

// 对参数组件进行解码
function decode_param(val) {
  if (typeof val !== "string" || val.length === 0) {
    return val;
  }

  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = "Failed to decode param '" + val + "'";
      err.status = err.statusCode = 400;
    }

    throw err;
  }
}
