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

var debug = require("debug")("express:view");
var path = require("path");
var fs = require("fs");

/**
 * Module variables.
 * @private
 */

var dirname = path.dirname;
var basename = path.basename;
var extname = path.extname;
var join = path.join;
var resolve = path.resolve;

/**
 * Module exports.
 * @public
 */

module.exports = View;

function View(name, options) {
  var opts = options || {};

  this.defaultEngine = opts.defaultEngine;
  this.ext = extname(name);
  this.name = name;
  this.root = opts.root;

  // 默认的视图文档解析器
  if (!this.ext && !this.defaultEngine) {
    throw new Error(
      "No default engine was specified and no extension was provided."
    );
  }

  var fileName = name;

  if (!this.ext) {
    // get extension from default engine name
    this.ext =
      this.defaultEngine[0] !== "."
        ? "." + this.defaultEngine
        : this.defaultEngine;

    fileName += this.ext;
  }

  if (!opts.engines[this.ext]) {
    // load engine
    var mod = this.ext.substr(1);
    debug('require "%s"', mod);

    // default engine export
    var fn = require(mod).__express;

    if (typeof fn !== "function") {
      throw new Error('Module "' + mod + '" does not provide a view engine.');
    }

    opts.engines[this.ext] = fn;
  }

  // store loaded engine
  this.engine = opts.engines[this.ext];

  // lookup path
  this.path = this.lookup(fileName);
}

//文件查找
View.prototype.lookup = function lookup(name) {
  var path;
  var roots = [].concat(this.root);

  debug('lookup "%s"', name);

  for (var i = 0; i < roots.length && !path; i++) {
    var root = roots[i];

    // resolve the path
    var loc = resolve(root, name);
    var dir = dirname(loc);
    var file = basename(loc);

    // resolve the file
    path = this.resolve(dir, file);
  }

  return path;
};

// 渲染过程，即根据请求生成对应的文档并保存到文件系统特定路径下
View.prototype.render = function render(options, callback) {
  debug('render "%s"', this.path);
  this.engine(this.path, options, callback);
};

// 基于给定的目录路径和文件名，返回文件的绝对路径
View.prototype.resolve = function resolve(dir, file) {
  var ext = this.ext;

  // <path>.<ext>
  var path = join(dir, file);
  var stat = tryStat(path);

  if (stat && stat.isFile()) {
    return path;
  }

  // <path>/index.<ext>
  path = join(dir, basename(file, ext), "index" + ext);
  stat = tryStat(path);

  if (stat && stat.isFile()) {
    return path;
  }
};

// 返回文件系统中特定路径下文件的状态信息
function tryStat(path) {
  debug('stat "%s"', path);

  try {
    return fs.statSync(path);
  } catch (e) {
    return undefined;
  }
}
