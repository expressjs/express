# Express

Fast, unopinionated, minimalist web framework for Node.js

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Linux Build][linux-build-image]][linux-build-url]
[![Windows Build][windows-build-image]][windows-build-url]
[![Test Coverage][test-coverage-image]][test-coverage-url]

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Docs & Community](#docs--community)
- [Security Issues](#security-issues)
- [Contributing](#contributing-to-express)
- [People](#people)
- [License](#license)

## Installation

```sh
$ npm install express --save
```

### Quick Start

The quickest way to get started with Express is to use the [`express-generator`](https://expressjs.com/en/starter/generator.html) CLI tool to create an application skeleton.

```sh
$ npm install -g express-generator@latest
$ express myapp
$ cd myapp
$ npm install
$ npm start
```

## Features

- Robust routing
- Focus on high performance
- Super-high test coverage
- HTTP helpers (redirection, caching, etc.)
- View system supporting multiple template engines
- Content negotiation
- Executable for generating applications quickly

## Docs & Community

- [Website and Documentation](https://expressjs.com/)
- [#express](https://web.libera.chat/#express) on Libera Chat IRC
- [GitHub Discussions](https://github.com/expressjs/express/discussions)
- [Gitter](https://gitter.im/expressjs/express)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/express)

## Security Issues

If you discover a security vulnerability, please see our [Security Policies and Procedures](./Security.md).

## Contributing to Express

We encourage contribution! Please read our [Contributing Guide](./Contributing.md) before submitting an issue or PR.

## People

The original author of Express is [TJ Holowaychuk](https://github.com/tj), and it is now maintained by the [Express team](https://github.com/orgs/expressjs/people).

### TSC (Technical Steering Committee)

- [@dougwilson](https://github.com/dougwilson)
- [@madhavarshney](https://github.com/madhavarshney)
- [@islut1](https://github.com/islut1)

### Triagers

- [@LinusU](https://github.com/LinusU)
- [@UlisesGascon](https://github.com/UlisesGascon)

## License

[MIT](LICENSE)

[npm-version-image]: https://img.shields.io/npm/v/express.svg
[npm-downloads-image]: https://img.shields.io/npm/dm/express.svg
[npm-url]: https://npmjs.org/package/express
[node-version-image]: https://img.shields.io/node/v/express.svg
[node-version-url]: https://nodejs.org/en/
[linux-build-image]: https://github.com/expressjs/express/workflows/Linux%20build/badge.svg
[linux-build-url]: https://github.com/expressjs/express/actions?query=workflow%3A%22Linux+build%22
[windows-build-image]: https://github.com/expressjs/express/workflows/Windows%20build/badge.svg
[windows-build-url]: https://github.com/expressjs/express/actions?query=workflow%3A%22Windows+build%22
[test-coverage-image]: https://img.shields.io/coveralls/expressjs/express/master.svg
[test-coverage-url]: https://coveralls.io/r/expressjs/express?branch=master
