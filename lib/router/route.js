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

var debug = require("debug")("express:router:route");

// 将嵌套结构的数组进行扁平化处理
var flatten = require("array-flatten");

// 针对同一个路由，可能存在多个处理器。因此Layer表示其中一个处理过程
var Layer = require("./layer");

// HTTP动词
var methods = require("methods");

// 节省属性访问开销
var slice = Array.prototype.slice;
var toString = Object.prototype.toString;

// 暴露的路由模块
module.exports = Route;

// 基于真实路由path生成路由模块
function Route(path) {
  this.path = path;
  this.stack = [];

  debug("new %o", path);

  // route handlers for various http methods
  this.methods = {};
}

/**
 * Determine if the route handles a given method.
 * @private
 */

Route.prototype._handles_method = function _handles_method(method) {
  if (this.methods._all) {
    return true;
  }

  // HTTP动词小写
  var name = method.toLowerCase();

  // 将head动词转为get动词
  if (name === "head" && !this.methods["head"]) {
    name = "get";
  }

  // 判定express实例的路由模块是否支持特定的HTTP动词
  return Boolean(this.methods[name]);
};

/**
 * @return {Array} supported HTTP methods
 * @private
 */

//  枚举当前express实例支持的HTTP动词列表
Route.prototype._options = function _options() {
  var methods = Object.keys(this.methods);

  // append automatic head
  if (this.methods.get && !this.methods.head) {
    methods.push("head");
  }

  for (var i = 0; i < methods.length; i++) {
    // make upper case
    methods[i] = methods[i].toUpperCase();
  }

  return methods;
};

/**
 * dispatch req, res into this route
 * @private
 */

//  将拦截的HTTP请求报文和响应报文与当前路由模块进行绑定处理
Route.prototype.dispatch = function dispatch(req, res, done) {
  var idx = 0;
  var stack = this.stack;
  if (stack.length === 0) {
    return done();
  }

  var method = req.method.toLowerCase();
  if (method === "head" && !this.methods["head"]) {
    method = "get";
  }

  req.route = this;

  next();

  function next(err) {
    // signal to exit route
    if (err && err === "route") {
      return done();
    }

    // signal to exit router
    if (err && err === "router") {
      return done(err);
    }

    //
    var layer = stack[idx++];
    if (!layer) {
      return done(err);
    }

    if (layer.method && layer.method !== method) {
      return next(err);
    }

    if (err) {
      layer.handle_error(err, req, res, next);
    } else {
      layer.handle_request(req, res, next);
    }
  }
};

// 处理所有路由的handler
Route.prototype.all = function all() {
  var handles = flatten(slice.call(arguments));

  for (var i = 0; i < handles.length; i++) {
    var handle = handles[i];

    if (typeof handle !== "function") {
      var type = toString.call(handle);
      var msg = "Route.all() requires a callback function but got a " + type;
      throw new TypeError(msg);
    }

    var layer = Layer("/", {}, handle);
    layer.method = undefined;

    this.methods._all = true;
    this.stack.push(layer);
  }

  return this;
};

// 这是node内置的HTTP动词模块
methods.forEach(function(method) {
  Route.prototype[method] = function() {
    // 特定HTTP处理动作的参数列表，其实类似app.get('/user',()=>{})形式
    var handles = flatten(slice.call(arguments));

    for (var i = 0; i < handles.length; i++) {
      var handle = handles[i];

      // 如果参数非函数，则抛出错误
      if (typeof handle !== "function") {
        var type = toString.call(handle);
        var msg =
          "Route." +
          method +
          "() requires a callback function but got a " +
          type;
        throw new Error(msg);
      }

      debug("%s %o", method, this.path);

      // 将侦听特定路由的函数处理器添加到layer实例中
      var layer = Layer("/", {}, handle);
      layer.method = method;

      // 表示当前express支持的合法HTTP动词
      this.methods[method] = true;
      this.stack.push(layer);
    }

    return this;
  };
});
