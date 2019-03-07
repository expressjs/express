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

If you discover a security vulnerability in Express, please see [Security Policies and Procedures](Security.md).

## Quick Start

The quickest way to get started with express is to utilize the executable [`express(1)`](https://github.com/expressjs/generator) to generate an application as shown below:

Install the executable. The executable's major version will match Express's:

```bash
$ npm install -g express-generator@4
```

Create the app:

```bash
$ express /tmp/foo && cd /tmp/foo
```

Install dependencies:

```bash
$ npm install
```

Start the server:

```bash
$ npm start
```

## 设计哲学

The Express philosophy is to provide small, robust tooling for HTTP servers, making
it a great solution for single page applications, web sites, hybrids, or public
HTTP APIs.

Express does not force you to use any specific ORM or template engine. With support for over
14 template engines via [Consolidate.js](https://github.com/tj/consolidate.js),
you can quickly craft your perfect framework.

## Examples

To view the examples, clone the Express repo and install the dependencies:

```bash
$ git clone git://github.com/expressjs/express.git --depth 1
$ cd express
$ npm install
```

Then run whichever example you want:

```bash
$ node examples/content-negotiation
```

## Tests

To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## People

The original author of Express is [TJ Holowaychuk](https://github.com/tj)

The current lead maintainer is [Douglas Christopher Wilson](https://github.com/dougwilson)

[List of all contributors](https://github.com/expressjs/express/graphs/contributors)

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
