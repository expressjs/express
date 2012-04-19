
# app

  Application prototype.

# app.use()

  Proxy `connect#use()` to apply settings to
  mounted applications.

# app.engine()

  Register the given template engine callback `fn`
  as `ext`.
  
  By default will `require()` the engine based on the
  file extension. For example if you try to render
  a "foo.jade" file Express will invoke the following internally:
  
      app.engine('jade', require('jade').__express);
  
  For engines that do not provide `.__express` out of the box,
  or if you wish to "map" a different extension to the template engine
  you may use this method. For example mapping the EJS template engine to
  ".html" files
  
      app.engine('html', require('ejs').renderFile);
  
  In this case EJS provides a `.renderFile()` method with
  the same signature that Express expects: `(path, options, callback)`,
  though note that it aliases this method as `ejs.__express` internally
  so if you're using ".ejs" extensions you dont need to do anything.
  
  Some template engines do not follow this convention, the
  [Consolidate.js](https://github.com/visionmedia/consolidate.js)
  library was created to map all of node's popular template
  engines to follow this convention, thus allowing them to
  work seemlessly within Express.

# app.param()

  Map the given param placeholder `name`(s) to the given callback(s).
  
  Parameter mapping is used to provide pre-conditions to routes
  which use normalized placeholders. For example a _:user_id_ parameter
  could automatically load a user's information from the database without
  any additional code,
  
  The callback uses the samesignature as middleware, the only differencing
  being that the value of the placeholder is passed, in this case the _id_
  of the user. Once the `next()` function is invoked, just like middleware
  it will continue on to execute the route, or subsequent parameter functions.
  
       app.param('user_id', function(req, res, next, id){
         User.find(id, function(err, user){
           if (err) {
             next(err);
           } else if (user) {
             req.user = user;
             next();
           } else {
             next(new Error('failed to load user'));
           }
         });
       });

# app.set()

  Assign `setting` to `val`, or return `setting`'s value.
  
     app.set('foo', 'bar');
     app.get('foo');
     // => "bar"
  
  Mounted servers inherit their parent server's settings.

# app.enabled()

  Check if `setting` is enabled (truthy).
  
     app.enabled('foo')
     // => false
  
     app.enable('foo')
     app.enabled('foo')
     // => true

# app.disabled()

  Check if `setting` is disabled.
  
     app.disabled('foo')
     // => true
  
     app.enable('foo')
     app.disabled('foo')
     // => false

# app.enable()

  Enable `setting`.

# app.disable()

  Disable `setting`.

# app.configure()

  Configure callback for zero or more envs,
  when no `env` is specified that callback will
  be invoked for all environments. Any combination
  can be used multiple times, in any order desired.
  
  ## Examples
  
     app.configure(function(){
       // executed for all envs
     });
  
     app.configure('stage', function(){
       // executed staging env
     });
  
     app.configure('stage', 'production', function(){
       // executed for stage and production
     });
  
  ## Note
  
   These callbacks are invoked immediately, and
   are effectively sugar for the following.
  
      var env = process.env.NODE_ENV || 'development';
  
       switch (env) {
         case 'development':
           ...
           break;
         case 'stage':
           ...
           break;
         case 'production':
           ...
           break;
       }

# app.all()

  Special-cased "all" method, applying the given route `path`,
  middleware, and callback to _every_ HTTP method.

# app.render()

  Render the given view `name` name with `options`
  and a callback accepting an error and the
  rendered template string.
  
  ## Example
  
     app.render('email', { name: 'Tobi' }, function(err, html){
       // ...
     })

# app.listen()

  Listen for connections.
  
  A node `http.Server` is returned, with this
  application (which is a `Function`) as its
  callback. If you wish to create both an HTTP
  and HTTPS server you may do so with the "http"
  and "https" modules as shown here.
  
     var http = require('http')
       , https = require('https')
       , express = require('express')
       , app = express();
  
     http.createServer(app).listen(80);
     http.createServer({ ... }, app).listen(443);


# req

  Request prototype.

# req.get()

  Return request header.
  
  The `Referrer` header field is special-cased,
  both `Referrer` and `Referer` will yield are
  interchangeable.
  
  ## Examples
  
      req.get('Content-Type');
      // => "text/plain"
      
      req.get('content-type');
      // => "text/plain"
        
      req.get('Something');
      // => undefined

# req.accepts()

  Check if the given `type(s)` is acceptable, returning
  the best match when true, otherwise `undefined`, in which
  case you should respond with 406 "Not Acceptable".
  
  The `type` value may be a single mime type string
  such as "application/json", the extension name
  such as "json", a comma-delimted list such as "json, html, text/plain",
  or an array `["json", "html", "text/plain"]`. When a list
  or array is given the _best_ match, if any is returned.
  
  ## Examples
  
      // Accept: text/html
      req.accepts('html');
        // => "html"
  
      // Accept: text/*, application/json
      req.accepts('html');
      // => "html"
      req.accepts('text/html');
      // => "text/html"
      req.accepts('json, text');
      // => "json"
      req.accepts('application/json');
      // => "application/json"
  
      // Accept: text/*, application/json
      req.accepts('image/png');
      req.accepts('png');
      // => undefined
  
      // Accept: text/*;q=.5, application/json
      req.accepts(['html', 'json']);
      req.accepts('html, json');
      // => "json"

# req.acceptsCharset()

  Check if the given `charset` is acceptable,
  otherwise you should respond with 406 "Not Acceptable".

# req.acceptsLanguage()

  Check if the given `lang` is acceptable,
  otherwise you should respond with 406 "Not Acceptable".

# req.param()

  Return the value of param `name` when present or `defaultValue`.
  
   - Checks body params, ex: id=12, {"id":12}
   - Checks route placeholders, ex: _/user/:id_
   - Checks query string params, ex: ?id=12
  
  To utilize request bodies, `req.body`
  should be an object. This can be done by using
  the `connect.bodyParser()` middleware.

# req.is()

  Check if the incoming request contains the "Content-Type" 
  header field, and it contains the give mime `type`.
  
  ## Examples
  
       // With Content-Type: text/html; charset=utf-8
       req.is('html');
       req.is('text/html');
       req.is('text/*');
       // => true
      
       // When Content-Type is application/json
       req.is('json');
       req.is('application/json');
       req.is('application/*');
       // => true
      
       req.is('html');
       // => false
  
   Now within our route callbacks, we can use to to assert content types
   such as "image/jpeg", "image/png", etc.
  
       app.post('/image/upload', function(req, res, next){
         if (req.is('image/*')) {
           // do something
         } else {
           next();
         }
       });


# res

  Response prototype.

# res.status()

  Set status `code`.

# res.send()

  Send a response.
  
  ## Examples
  
      res.send(new Buffer('wahoo'));
      res.send({ some: 'json' });
      res.send('<p>some html</p>');
      res.send(404, 'Sorry, cant find that');
      res.send(404);

# res.json()

  Send JSON response.
  
  ## Examples
  
      res.json(null);
      res.json({ user: 'tj' });
      res.json(500, 'oh noes!');
      res.json(404, 'I dont have that');

# res.sendfile()

  Transfer the file at the given `path`.
  
  Automatically sets the _Content-Type_ response header field.
  The callback `fn(err)` is invoked when the transfer is complete
  or when an error occurs. Be sure to check `res.sentHeader`
  if you wish to attempt responding, as the header and some data
  may have already been transferred.
  
  ## Options
  
    - `maxAge` defaulting to 0
    - `root`   root directory for relative filenames
  
  ## Examples
  
   The following example illustrates how `res.sendfile()` may
   be used as an alternative for the `static()` middleware for
   dynamic situations. The code backing `res.sendfile()` is actually
   the same code, so HTTP cache support etc is identical.
  
      app.get('/user/:uid/photos/:file', function(req, res){
        var uid = req.params.uid
          , file = req.params.file;
      
        req.user.mayViewFilesFrom(uid, function(yes){
          if (yes) {
            res.sendfile('/uploads/' + uid + '/' + file);
          } else {
            res.send(403, 'Sorry! you cant see that.');
          }
        });
      });

# res.download()

  Transfer the file at the given `path` as an attachment.
  
  Optionally providing an alternate attachment `filename`,
  and optional callback `fn(err)`. The callback is invoked
  when the data transfer is complete, or when an error has
  ocurred. Be sure to check `res.headerSent` if you plan to respond.

# res.format()

  Respond to the Acceptable formats using an `obj`
  of mime-type callbacks.
  
  This method uses `req.accepted`, an array of
  acceptable types ordered by their quality values.
  When "Accept" is not present the _first_ callback
  is invoked, otherwise the first match is used. When
  no match is performed the server responds with
  406 "Not Acceptable".
  
  Content-Type is set for you, however if you choose
  you may alter this within the callback using `res.type()`
  or `res.set('Content-Type', ...)`.
  
     res.format({
       'text/plain': function(){
         res.send('hey');
       },
     
       'text/html': function(){
         res.send('<p>hey</p>');
       },
     
       'appliation/json': function(){
         res.send({ message: 'hey' });
       }
     });
  
  In addition to canonicalized MIME types you may
  ## also use extnames mapped to these types
  
     res.format({
       text: function(){
         res.send('hey');
       },
     
       html: function(){
         res.send('<p>hey</p>');
       },
     
       json: function(){
         res.send({ message: 'hey' });
         }
     });

# res.attachment()

  Set _Content-Disposition_ header to _attachment_ with optional `filename`.

# res.set()

  Set header `field` to `val`, or pass
  an object of of header fields.
  
  ## Examples
  
     res.set('Accept', 'application/json');
     res.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });

# res.get()

  Get value for header `field`.

# res.clearCookie()

  Clear cookie `name`.

# res.signedCookie()

  Set a signed cookie with the given `name` and `val`.
  See `res.cookie()` for details.

# res.cookie()

  Set cookie `name` to `val`, with the given `options`.
  
  ## Options
  
     - `maxAge`   max-age in milliseconds, converted to `expires`
     - `path`     defaults to "/"
  
  ## Examples
  
     // "Remember Me" for 15 minutes
     res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
  
     // save as above
     res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })

# res.redirect()

  Redirect to the given `url` with optional response `status`
  defaulting to 302.
  
  The given `url` can also be the name of a mapped url, for
  example by default express supports "back" which redirects
  to the _Referrer_ or _Referer_ headers or "/".
  
  ## Examples
  
     res.redirect('/foo/bar');
     res.redirect('http://example.com');
     res.redirect(301, 'http://example.com');
     res.redirect('../login'); // /blog/post/1 -> /blog/login
  
  ## Mounting
  
    When an application is mounted, and `res.redirect()`
    is given a path that does _not_ lead with "/". For 
    example suppose a "blog" app is mounted at "/blog",
    the following redirect would result in "/blog/login":
  
       res.redirect('login');
  
    While the leading slash would result in a redirect to "/login":
  
       res.redirect('/login');

# res.render()

  Render `view` with the given `options` and optional callback `fn`.
  When a callback function is given a response will _not_ be made
  automatically, otherwise a response of _200_ and _text/html_ is given.
  
  ## Options
   
   - `status`    Response status code (`res.statusCode`)
   - `charset`   Set the charset (`res.charset`)
  
  ## Reserved locals
  
   - `cache`     boolean hinting to the engine it should cache
   - `filename`  filename of the view being rendered

