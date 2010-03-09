
# Express
      
  Insanely fast (and small) server-side JavaScript web development framework
  built on **node.js** and the **V8 JavaScript engine**.

  * Visit the [Wiki](http://wiki.github.com/visionmedia/express) for documentation
  * Visit the [Google Group](http://groups.google.com/group/express-js) for discussion

## Features (so far)

  * Sexy DSL with robust sinatra-like routing
  * High performance
  * Session support
  * Mime helpers
  * Redirection helpers
  * Nested parameter parsing
  * Full test coverage
  * Extremely readable specs
  * Test helpers (mock requests etc)
  * Environment based configuration
  * Light-weight JavaScript class implementation via js-oo
  * Collections and chainable iterators
  * View support (ejs, haml, sass, etc)
  
## Installation

Currently Express must be cloned (or downloaded), you can use the following command to
get rolling and initialize the submodule dependencies:

    $ git clone git://github.com/visionmedia/express.git && cd express && git submodule update --init && make app
    
Or with the [gh](http://github.com/visionmedia/gh) utility:

    $ gh clone visionmedia express && cd express && git submodule update --init && make app

## Performance

  Extensive performance enhancements have not yet been made,
  since we are focusing on the framework it-self at the moment. 
  
  However if you are interested view the premature [benchmarks for Express framework](http://vision-media.ca/resources/nodejs/express-nodejs-web-development-framework-performance).

## Examples

Below is a minimal app example when express is already within your load path.

    require('express')
    require('express/plugins')
    
    configure(function(){
      use(MethodOverride)
      use(ContentLength)
      set('root', __dirname)
    })
    
    get('/hello', function(){
      this.contentType('html')
      return '<h1>World<h1>'
    })
    
    get('/user/:id?', function(id) {
      this.render('user.haml.html', {
        locals: {
          name: id ? 'User ' + id : 'You' 
        }
      })
    })
    
    run()
  
## Running Tests

Express uses the [JSpec](http://jspec.info) BDD JavaScript testing
framework to write and run elegant spec suites. JSpec is frozen 
to spec/lib and does not require separate installation.

To run all specifications run the following command. This will ensure
git submodules are initialized and updated, as well as building test
related dependencies such as libxmljs.

    $ make test
    
To run independent specs (which do not require building of external apis etc) use:

    $ make test-independant
    
To run dependent specs (which require building of external apis etc) use:

    $ make test-dependant
    
Run individual suites:

    $ node spec/node.js core
    $ node spec/node.js mime
    $ node spec/node.js routing
    ...
    
Express is currently being developed with node --version:
    v0.1.31
    
## More Information

  * [JavaScript Extensions &amp; Utilities](http://github.com/visionmedia/ext.js)
  * [JavaScript Sass](http://github.com/visionmedia/sass.js)
  * [Scons Build System](http://www.scons.org/) (some development dependencies rely on this, ex libxmljs)
  * Featured in [Advanced JavaScript e-book](http://www.dev-mag.com/2010/02/18/advanced-javascript/) for only $4
    
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
