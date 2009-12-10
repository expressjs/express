
# Express
      
  Insanely fast (and small) server-side JavaScript web development framework
  built on **node.js** and the **V8 JavaScript engine**.

  * Stay tuned, coming soon :)

## Features (so far)

  * Sexy DSL
  * Mime helpers
  * Nested parameter parsing
  * Full test coverage
  * Test helpers (mock requests etc)
  * Cookie support
  * Session support
  * Faux method support for RESTful apps
  * Extendable using Express 'Modules'
  * Static file serving
  * View support
  * Collections and chainable iterators
  * Routing
    * string matching       
    * regexp with captures  
    * param key substitution
    * pre-conditions
    * overidding
    * etc

## Performance

  Extensive benchmarking will wait until a development version
  has been released. However for simple an average route and response
  body Ruby's Sinatra scored **1454** request per second using Thin, while
  Express scored **3600**.
  
  Currently Express can chew through **1000** simple requests with a 
  concurrency of **40** in **0.262** seconds.

## Examples

  require.paths.unshift("./lib")
  require('express')
  
  set('views', dirname(__filename) + '/views')
  
  get('/user/:id?', function() {
    if (param('id'))
      return 'Viewing user ' + param('id')
    return 'Your user account'
  })
  
## Settings

  set('views', '/path/to/views')
  set('views') // => '/path/to/views'
  
  enable('foo')
  disable('bar')
    
## Collections

Express ships with the Collection class, allowing
you to chain iterations on array-like objects and objects.

    $(['tj', 'matt', 'taylor'])
      .select(function(name){ return name.charAt(0) == 't' })
      .reject(function(name){ return name.length < 4 })
      .first()

## Running Tests

Express uses the [JSpec](http://jspec.info) BDD JavaScript testing
framework to write and run elegant spec suites. JSpec is froozen 
to spec/lib and does not require seperate installation.

To run all specifications:

    $ make test
    
Run individual suites:

    $ node spec/spec.node.js core
    $ node spec/spec.node.js mime
    $ node spec/spec.node.js routing
    ...
    
## License 

(The MIT License)

Copyright (c) 2009 TJ Holowaychuk <tj@vision-media.ca>

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
