[![express logo](http://f.cl.ly/items/0V2S1n0K1i3y1c122g04/Screen%20Shot%202012-04-11%20at%209.59.42%20AM.png)](http://expressjs.com/)

  Fast, unopinionated, minimalist web framework for [node](http://nodejs.org).

  [![NPM version](https://img.shields.io/npm/v/express.svg)](https://www.npmjs.org/package/express)
  [![Build Status](https://img.shields.io/travis/strongloop/express/3.x.svg)](https://travis-ci.org/strongloop/express)
  [![Coverage Status](https://img.shields.io/coveralls/strongloop/express/3.x.svg)](https://coveralls.io/r/strongloop/express)
  [![Gratipay](https://img.shields.io/gratipay/dougwilson.svg)](https://gratipay.com/dougwilson/)

```js
var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('Hello World');
});

app.listen(3000);
```

## Installation

    $ npm install -g express

## Quick Start

 The quickest way to get started with express is to utilize the executable `express(1)` to generate an application as shown below:

 Create the app:

    $ npm install -g express
    $ express /tmp/foo && cd /tmp/foo

 Install dependencies:

    $ npm install

 Start the server:

    $ node app

## Features

  * Built on [Connect](http://github.com/senchalabs/connect)
  * Robust routing
  * HTTP helpers (redirection, caching, etc)
  * View system supporting 14+ template engines
  * Content negotiation
  * Focus on high performance
  * Environment based configuration
  * Executable for generating applications quickly
  * High test coverage

## Philosophy

  The Express philosophy is to provide small, robust tooling for HTTP servers, making
  it a great solution for single page applications, web sites, hybrids, or public
  HTTP APIs.

  Built on Connect, you can use _only_ what you need, and nothing more. Applications
  can be as big or as small as you like, even a single file. Express does
  not force you to use any specific ORM or template engine. With support for over
  14 template engines via [Consolidate.js](http://github.com/visionmedia/consolidate.js),
  you can quickly craft your perfect framework.

## More Information

  * [Website and Documentation](http://expressjs.com/) stored at [strongloop/expressjs.com](https://github.com/strongloop/expressjs.com)
  * Join #express on freenode
  * [Google Group](http://groups.google.com/group/express-js) for discussion
  * Follow [tjholowaychuk](http://twitter.com/tjholowaychuk) on twitter for updates
  * Visit the [Wiki](http://github.com/strongloop/express/wiki)
  * [Русскоязычная документация](http://jsman.ru/express/)
  * Run express examples [online](https://runnable.com/express)

## Viewing Examples

Clone the Express repo, then install the dev dependencies to install all the example / test suite dependencies:

    $ git clone git://github.com/strongloop/express.git --depth 1
    $ cd express
    $ npm install

Then run whichever tests you want:

    $ node examples/content-negotiation

You can also view live examples here:

<a href="https://runnable.com/express" target="_blank"><img src="https://runnable.com/external/styles/assets/runnablebtn.png" style="width:67px;height:25px;"></a>

## Running Tests

To run the test suite, first invoke the following command within the repo, installing the development dependencies:

    $ npm install

Then run the tests:

```sh
$ npm test
```

## Contributors

  https://github.com/strongloop/express/graphs/contributors

## License

(The MIT License)

Copyright (c) 2009-2012 TJ Holowaychuk &lt;tj@vision-media.ca&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
