/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

"use strict";

// 重置对象的原型对象，这种操作由于比较慢因此建议避免；而采用object.create()方式替代
var setPrototypeOf = require("setprototypeof");

// 参数app就是express实例
exports.init = function(app) {
  return function expressInit(req, res, next) {
    // 如何框架支持下面响应报文头部，则设置
    if (app.enabled("x-powered-by")) {
      // 在响应报文头部设置
      res.setHeader("X-Powered-By", "Express");
    }

    // 注意下面的精髓，就是将多个中间件基于“洋葱模型”构建
    req.res = res;
    res.req = req;
    req.next = next;

    // 重置对象的原型
    setPrototypeOf(req, app.request);
    setPrototypeOf(res, app.response);

    res.locals = res.locals || Object.create(null);

    next();
  };
};
