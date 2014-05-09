[![express logo](https://i.cloudup.com/zfY6lL7eFa-3000x3000.png)](http://expressjs.com/)

  Fast, unopinionated, minimalist web framework for [node](http://nodejs.org).

  [![Build Status](https://travis-ci.org/visionmedia/express.svg?branch=master)](https://travis-ci.org/visionmedia/express) [![Gittip](http://img.shields.io/gittip/visionmedia.svg)](https://www.gittip.com/visionmedia/) [![NPM version](https://badge.fury.io/js/express.svg)](http://badge.fury.io/js/express)

```js
var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('Hello World');
});

app.listen(3000);
```

**PROTIP** Be sure to read [Migrating from 3.x to 4.x](https://github.com/visionmedia/express/wiki/Migrating-from-3.x-to-4.x) as well as [New features in 4.x](https://github.com/visionmedia/express/wiki/New-features-in-4.x).

## Installation

    $ npm install express

## Quick Start

 The quickest way to get started with express is to utilize the executable [`express(1)`](http://github.com/expressjs/generator) to generate an application as shown below:
 
 Install the executable. The executable's major version will match Express's:
 
    $ npm install -g express-generator@3

 Create the app:

    $ express /tmp/foo && cd /tmp/foo

 Install dependencies:

    $ npm install

 Start the server:

    $ npm start

## Features

  * Robust routing
  * HTTP helpers (redirection, caching, etc)
  * View system supporting 14+ template engines
  * Content negotiation
  * Focus on high performance
  * Executable for generating applications quickly
  * High test coverage

## Philosophy

  The Express philosophy is to provide small, robust tooling for HTTP servers, making
  it a great solution for single page applications, web sites, hybrids, or public
  HTTP APIs.

  Express does not force you to use any specific ORM or template engine. With support for over
  14 template engines via [Consolidate.js](http://github.com/visionmedia/consolidate.js),
  you can quickly craft your perfect framework.

## More Information

  * [Website and Documentation](http://expressjs.com/) stored at [visionmedia/expressjs.com](https://github.com/visionmedia/expressjs.com)
  * Join #express on freenode
  * [Google Group](http://groups.google.com/group/express-js) for discussion
  * Follow [tjholowaychuk](http://twitter.com/tjholowaychuk) and [defunctzombie](https://twitter.com/defunctzombie) on twitter for updates
  * Visit the [Wiki](http://github.com/visionmedia/express/wiki)
  * [Русскоязычная документация](http://jsman.ru/express/)
  * Run express examples [online](https://runnable.com/express)

## Viewing Examples

Clone the Express repo, then install the dev dependencies to install all the example / test suite dependencies:

    $ git clone git://github.com/visionmedia/express.git --depth 1
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

    $ make test

## Contributors
  
  Author: [TJ Holowaychuk](http://github.com/visionmedia)  
  Lead Maintainer: [Roman Shtylman](https://github.com/defunctzombie)  
  Contributors: https://github.com/visionmedia/express/graphs/contributors  

## License

MIT
