/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

"use strict";

// 两个对象的属性合并处理
var merge = require("utils-merge");

// 具有缓存能力的URL解析器
var parseUrl = require("parseurl");

// querystring 解析器
var qs = require("qs");

// 对HTTP请求报文携带的参数进行解析
module.exports = function query(options) {
  var opts = merge({}, options);
  var queryparse = qs.parse;

  if (typeof options === "function") {
    queryparse = options;
    opts = undefined;
  }

  if (opts !== undefined && opts.allowPrototypes === undefined) {
    // back-compat for qs module
    opts.allowPrototypes = true;
  }

  // 对HTTP请求报文中参数的解析处理
  return function query(req, res, next) {
    if (!req.query) {
      var val = parseUrl(req).query;
      req.query = queryparse(val, opts);
    }

    next();
  };
};
