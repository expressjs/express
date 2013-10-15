[![express logo](http://f.cl.ly/items/0V2S1n0K1i3y1c122g04/Screen%20Shot%202012-04-11%20at%209.59.42%20AM.png)](http://expressjs.com/)

  Fast, unopinionated, minimalist web framework for [node](http://nodejs.org). [![Build Status](https://secure.travis-ci.org/visionmedia/express.png)](http://travis-ci.org/visionmedia/express)

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

  The Express philosophy is to provide small, robust tooling for HTTP servers. Making
  it a great solution for single page applications, web sites, hybrids, or public
  HTTP APIs.

  Built on Connect you can use _only_ what you need, and nothing more, applications
  can be as big or as small as you like, even a single file. Express does
  not force you to use any specific ORM or template engine. With support for over
  14 template engines via [Consolidate.js](http://github.com/visionmedia/consolidate.js)
  you can quickly craft your perfect framework.

## More Information

  * [Website and Documentation](http://expressjs.com/) stored at [visionmedia/expressjs.com](https://github.com/visionmedia/expressjs.com)
  * Join #express on freenode
  * [Google Group](http://groups.google.com/group/express-js) for discussion
  * Follow [tjholowaychuk](http://twitter.com/tjholowaychuk) on twitter for updates
  * Visit the [Wiki](http://github.com/visionmedia/express/wiki)
  * [Русскоязычная документация](http://jsman.ru/express/)
  * Run express examples [online](https://runnable.com/express)

## Viewing Examples

Clone the Express repo, then install the dev dependencies to install all the example / test suite deps:

    $ git clone git://github.com/visionmedia/express.git --depth 1
    $ cd express
    $ npm install

then run whichever tests you want:

    $ node examples/content-negotiation
    
You can also view live examples here

<a href="https://runnable.com/express" target="_blank"><img src="https://runnable.com/external/styles/assets/runnablebtn.png" style="width:67px;height:25px;"></a>

## Running Tests

To run the test suite first invoke the following command within the repo, installing the development dependencies:

    $ npm install

then run the tests:

    $ make test

## Contributors

```
project: express
commits: 3559
active : 468 days
files  : 237
authors:
 1891	Tj Holowaychuk          53.1%
 1285	visionmedia             36.1%
  182	TJ Holowaychuk          5.1%
   54	Aaron Heckmann          1.5%
   34	csausdev                1.0%
   26	ciaranj                 0.7%
   21	Robert Sköld            0.6%
    6	Guillermo Rauch         0.2%
    3	Dav Glass               0.1%
    3	Nick Poulden            0.1%
    2	Randy Merrill           0.1%
    2	Benny Wong              0.1%
    2	Hunter Loftis           0.1%
    2	Jake Gordon             0.1%
    2	Brian McKinney          0.1%
    2	Roman Shtylman          0.1%
    2	Ben Weaver              0.1%
    2	Dave Hoover             0.1%
    2	Eivind Fjeldstad        0.1%
    2	Daniel Shaw             0.1%
    1	Matt Colyer             0.0%
    1	Pau Ramon               0.0%
    1	Pero Pejovic            0.0%
    1	Peter Rekdal Sunde      0.0%
    1	Raynos                  0.0%
    1	Teng Siong Ong          0.0%
    1	Viktor Kelemen          0.0%
    1	ctide                   0.0%
    1	8bitDesigner            0.0%
    1	isaacs                  0.0%
    1	mgutz                   0.0%
    1	pikeas                  0.0%
    1	shuwatto                0.0%
    1	tstrimple               0.0%
    1	ewoudj                  0.0%
    1	Adam Sanderson          0.0%
    1	Andrii Kostenko         0.0%
    1	Andy Hiew               0.0%
    1	Arpad Borsos            0.0%
    1	Ashwin Purohit          0.0%
    1	Benjen                  0.0%
    1	Darren Torpey           0.0%
    1	Greg Ritter             0.0%
    1	Gregory Ritter          0.0%
    1	James Herdman           0.0%
    1	Jim Snodgrass           0.0%
    1	Joe McCann              0.0%
    1	Jonathan Dumaine        0.0%
    1	Jonathan Palardy        0.0%
    1	Jonathan Zacsh          0.0%
    1	Justin Lilly            0.0%
    1	Ken Sato                0.0%
    1	Maciej Małecki          0.0%
    1	Masahiro Hayashi        0.0%
```

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
