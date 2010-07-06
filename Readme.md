
# Express
      
  Insanely fast (and small) server-side JavaScript web development framework
  built on [node](http://nodejs.org) and [Connect](http://github.com/extjs/Connect).

  * Visit the [Websute](http://expressjs.com) for documentation
  * Visit the [Google Group](http://groups.google.com/group/express-js) for discussion
  
## Features

  * Sexy DSL with robust _sinatra-like_ routing
  * Environment based configuration
  * High performance
  * View support (ejs, jade, haml, sass, etc)
  * View partials
  * Full test coverage via [expresso](http://github.com/visionmedia/expresso)

Via Connect:

  * Session support
  * Cache API
  * Mime helpers
  * ETag support
  * Redirection helpers
  * Persistent flash notifications
  * Cookie support
  * JSON-RPC
  * Logging
  * and _much_ more!
  
## Installation

  Install the [Kiwi package manager for nodejs](http://github.com/visionmedia/kiwi)
  and run:
  
      $ kiwi install express

or via npm:

      $ npm install express

or

  Install via git clone:
  
      $ git clone git://github.com/visionmedia/express.git && cd express && git submodule update --init

## Running Tests

Express uses the [Expresso](http://github.com/visionmedia/expresso) TDD
framework to write and run elegant test suites extremely fast. First update
the git submodules, then run:

    $ make test
    
The latest release of Express is compatible with node --version:
    v0.1.100
    
## More Information

  * [JavaScript Extensions &amp; Utilities](http://github.com/visionmedia/ext.js)
  * [JavaScript Sass](http://github.com/visionmedia/sass.js)
  * [JavaScript Haml](http://github.com/visionmedia/haml.js)
  * [JavaScript Jade](http://github.com/visionmedia/jade) spiritual successor of Haml
  * Featured in [Advanced JavaScript e-book](http://www.dev-mag.com/2010/02/18/advanced-javascript/) for only $4
    
## Contributors

  * TJ Holowaychuk (visionmedia) &lt;tj@vision-media.ca&gt;
  * Aaron Heckmann (aheckmann) &lt;aaron.heckmann+github@gmail.com&gt;
  * Ciaran Jessup (ciaranj) &lt;ciaranj@gmail.com&gt;
    
## License 

(The MIT License)

Copyright (c) 2009-2010 TJ Holowaychuk &lt;tj@vision-media.ca&gt;

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
