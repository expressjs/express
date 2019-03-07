[![Express Logo](https://i.cloudup.com/zfY6lL7eFa-3000x3000.png)](http://expressjs.com/)

基于[node](http://nodejs.org)的简约高效 Web 框架.

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Linux Build][travis-image]][travis-url]
[![Windows Build][appveyor-image]][appveyor-url]
[![Test Coverage][coveralls-image]][coveralls-url]

```js
var express = require("express");
var app = express();

app.get("/", function(req, res) {
  res.send("Hello World");
});

app.listen(3000);
```

## 安装

express 是一个[node 模块](https://nodejs.org/en/)，可以通过[NPM 仓库](https://www.npmjs.com/)安装.

在安装 express 之前，请确保运行环境的 Node 版本不低于 10

基于下面命令安装
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install express
```

## 特性

- 健壮的路由能力
- 高性能
- 完备的测试覆盖
- 具备重定向、缓存等 HTTP 能力
- 内置 14 套视图模板引擎
- 内容协商
- 快速构建可用的 Web 服务

## 文档 & 社区

- [Website and Documentation](http://expressjs.com/) - [[website repo](https://github.com/expressjs/expressjs.com)]
- [#express](https://webchat.freenode.net/?channels=express) on freenode IRC
- [GitHub Organization](https://github.com/expressjs) for Official Middleware & Modules
- Visit the [Wiki](https://github.com/expressjs/express/wiki)
- [Google Group](https://groups.google.com/group/express-js) for discussion
- [Gitter](https://gitter.im/expressjs/express) for support and discussion

**PROTIP** Be sure to read [Migrating from 3.x to 4.x](https://github.com/expressjs/express/wiki/Migrating-from-3.x-to-4.x) as well as [New features in 4.x](https://github.com/expressjs/express/wiki/New-features-in-4.x).

### 安全报告

如果发现 express 存在安全漏洞，请查阅 [安全策略和处理过程](Security.md).

## 快速启动

基于 [`express(1)`](https://github.com/expressjs/generator)快速启动一个可用的 Web 服务器，其操作流程如下:

安装下面模块，该模块的版本需要匹配 express 模块:

```bash
$ npm install -g express-generator@4
```

创建应用:

```bash
$ express /tmp/foo && cd /tmp/foo
```

安装依赖:

```bash
$ npm install
```

启动服务器:

```bash
$ npm start
```

## 设计哲学

express 的设计哲学是提供一个简约健壮的 HTTP 服务器，使得开发 SPA、Web 站点服务、混合应用和 Restful APis 服务器变得非常容易。
express 并不强制安装和使用特定的视图模板引擎，事实上 express 内置了超过 14 个模板引擎。通过 [Consolidate.js](https://github.com/tj/consolidate.js)，可以帮助开发者快速打磨自己的模板.

## 例子

克隆 express 代码仓库，并执行下面操作:

```bash
$ git clone git://github.com/expressjs/express.git --depth 1
$ cd express
$ npm install
```

运行项目中提供的例子:

```bash
$ node examples/content-negotiation
```

## 测试

为了运行 express 框架，请执行 `npm test`:

```bash
$ npm install
$ npm test
```

## 主要作者

express 最开始的作者是 [TJ Holowaychuk](https://github.com/tj)

目前主要维护者为 [Douglas Christopher Wilson](https://github.com/dougwilson)

[贡献者列表](https://github.com/expressjs/express/graphs/contributors)

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/express.svg
[npm-url]: https://npmjs.org/package/express
[downloads-image]: https://img.shields.io/npm/dm/express.svg
[downloads-url]: https://npmjs.org/package/express
[travis-image]: https://img.shields.io/travis/expressjs/express/master.svg?label=linux
[travis-url]: https://travis-ci.org/expressjs/express
[appveyor-image]: https://img.shields.io/appveyor/ci/dougwilson/express/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/dougwilson/express
[coveralls-image]: https://img.shields.io/coveralls/expressjs/express/master.svg
[coveralls-url]: https://coveralls.io/r/expressjs/express?branch=master
[gratipay-image-visionmedia]: https://img.shields.io/gratipay/visionmedia.svg
[gratipay-url-visionmedia]: https://gratipay.com/visionmedia/
[gratipay-image-dougwilson]: https://img.shields.io/gratipay/dougwilson.svg
[gratipay-url-dougwilson]: https://gratipay.com/dougwilson/
