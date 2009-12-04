
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
  Express scored **2762**.

## Examples

See examples/simple.js for a working server that uses a synchronous handler. 
Just type "node examples/simple.js" and then go to http://localhost:3000/i/like/cheese

For an asynchronous example, run "node examples/async.js" and then go to http://localhost:3000/wait/2000

GET /user/tj/edit
  
    get('user/:name/:operation', function(){
      param('operation') + 'ing ' + param('name')
    })

GET /articles
  
    get('articles', function(){
      'list of articles'
    })

GET /articles/12
  
    get(/articles\/(\d+)/, function(){
      'article id ' + captures[1]
    })
  
POST /user/:id
  
    post('user/:id', function(){
      User.destroy(params('id')) ? 
        'User deleted' :
          'Failed to delete user'
    })
  
GET /login
  
    get('login', function() {
      '<form method="post" action="/login">        \
      <input type="text" name="user[name]" />      \
      <input type="password" name="user[pass]" />  \
      <input type="submit" value="Login"/>         \
      </form>'
    })
  
POST /login
    
    post('login', function() {
      'Welcome ' + param('user').name
    })
  
## Settings

    * basepath         : defaults to '/'
    * defaultRoute     : responds with page not found
    * mime.defaultType : defaults to 'application/octet-stream'
    * cookie.maxAge    : defaults to 3600 milliseconds
    
## Public API

  * Coming Soon
  
## Collections

Express ships with the Collection class, allowing
you to chain iterations on array-like objects.

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
    
## More Information

  * [Mojo](http://github.com/visionmedia/mojo) JavaScript Mustache Templates

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
