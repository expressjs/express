
# Express
      
  Insanely fast (and small) server-side JavaScript web development framework
  built on [node](http://nodejs.org) and [Connect](http://github.com/senchalabs/connect).
  
     var app = express.createServer();
     
     app.get('/', function(req, res){
       res.send('Hello World');
     });
     
     app.listen(3000);

## Installation

    $ npm install express

## Features

  * Robust routing
  * Redirection helpers
  * Dynamic view helpers
  * Content negotiation
  * Focus on high performance
  * View rendering and partials support
  * Environment based configuration
  * Session based flash notifications
  * Built on [Connect](http://github.com/senchalabs/connect)
  * High test coverage
  * Executable for generating applications quickly
  * Application level view options

Via Connect:

  * Session support
  * Cache API
  * Mime helpers
  * ETag support
  * Persistent flash notifications
  * Cookie support
  * JSON-RPC
  * Logging
  * and _much_ more!

## Contributors

The following are the major contributors of Express (in no specific order).

  * TJ Holowaychuk ([visionmedia](http://github.com/visionmedia))
  * Ciaran Jessup ([ciaranj](http://github.com/ciaranj))
  * Aaron Heckmann ([aheckmann](http://github.com/aheckmann))
  * Guillermo Rauch ([guille](http://github.com/guille))

## More Information

  * [express-configure](http://github.com/visionmedia/express-configuration) async configuration support
  * [express-messages](http://github.com/visionmedia/express-messages) flash notification rendering helper
  * [express-namespace](http://github.com/visionmedia/express-namespace) namespaced route support
  * Follow [tjholowaychuk](http://twitter.com/tjholowaychuk) on twitter for updates
  * [Google Group](http://groups.google.com/group/express-js) for discussion
  * Visit the [Wiki](http://github.com/visionmedia/express/wiki)
  * Screencast - [Introduction](http://bit.ly/eRYu0O)
  * Screencast - [View Partials](http://bit.ly/dU13Fx)
  * Screencast - [Route Specific Middleware](http://bit.ly/hX4IaH)
  * Screencast - [Route Path Placeholder Preconditions](http://bit.ly/eNqmVs)

## Node Compatibility

Express 1.x is compatible with node 0.2.x and connect < 1.0.

Express 2.x is compatible with node 0.4.x and connect 1.x

## License 

(The MIT License)

Copyright (c) 2009-2011 TJ Holowaychuk &lt;tj@vision-media.ca&gt;

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
