
# Express
      
  Insanely fast (and small) server-side JavaScript web development framework
  built on **node.js** and the **V8 JavaScript engine**.

  * Visit the [Wiki](http://wiki.github.com/visionmedia/express) for documentation
  * Visit the [Google Group](http://groups.google.com/group/express-js) for discussion

## Features (so far)

  * Sexy DSL with robust sinatra-like routing
  * High performance
  * Session support
  * Cache API
  * RESTful HTTP client
  * Mime helpers
  * ETag support
  * Redirection helpers
  * Multipart file upload support
  * Test helpers (mock requests etc)
  * Environment based configuration
  * Light-weight JavaScript class implementation via [class.js](http://github.com/visionmedia/class.js/)
  * Persistent flash messages
  * Route passing
  * View support (ejs, haml, sass, etc)
  * View partials
  * Full test coverage
  * Logger plugin with several formats
  * Upload size restrictions
  * Extremely readable specs
  * Cookie support
  
## Installation

  Install the [Kiwi package manager for nodejs](http://github.com/visionmedia/kiwi)
  and run:
  
      $ kiwi -v install express
      
or

  Install via git clone:
  
      $ git clone git://github.com/visionmedia/express.git && cd express && git submodule update --init

## Examples

Below is a tiny Express application. View the [Wiki](http://wiki.github.com/visionmedia/express/) for detailed information.

    require.paths.unshift('express/lib')
    require('express')
    
    configure(function(){
      set('root', __dirname)
    })
    
    get('/user', function(){
      this.redirect('/user/' + this.currentUser.id)
    })
    
    get('/user/:id', function(id){
      this.render('user.haml.html', {
        locals: {
          user: this.currentUser,
          usersOnline: Session.store.length()
        }
      })
    })

    run()
    
## Running Tests

Express uses the [JSpec](http://jspec.info) BDD JavaScript testing
framework to write and run elegant spec suites. JSpec is frozen 
to spec/lib and **does not** require separate installation.

    $ make test
    
Run individual suites:

    $ node spec/node.js core
    $ node spec/node.js mime
    $ node spec/node.js routing
    ...
    
The latest release of Express is compatible with node --version:
    v0.1.93
    
With _EDGE_ Express we do our best to keep up to date with node's _EDGE_
    
## More Information

  * [JavaScript Extensions &amp; Utilities](http://github.com/visionmedia/ext.js)
  * [JavaScript Sass](http://github.com/visionmedia/sass.js)
  * Featured in [Advanced JavaScript e-book](http://www.dev-mag.com/2010/02/18/advanced-javascript/) for only $4
  * [0.9.0 release details](http://tjholowaychuk.com/post/522036176/express-0-9-0-released)
  * [Express vs Sinatra Benchmarks](http://tjholowaychuk.com/post/543953703/express-vs-sinatra-benchmarks)
    
## Contributors

  * TJ Holowaychuk (visionmedia) &lt;tj@vision-media.ca&gt;
  * Aaron Heckmann (aheckmann) &lt;aaron.heckmann+github@gmail.com&gt;
  * Ciaran Jessup (ciaranj) &lt;ciaranj@gmail.com&gt;
  * Gareth Jones (csausdev) &lt;gareth.jones@sensis.com.au&gt;
    
## License 

(The MIT License)

Copyright (c) 2009 TJ Holowaychuk &lt;tj@vision-media.ca&gt;

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
