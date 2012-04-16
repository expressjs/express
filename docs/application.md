
# app

  Application prototype.

# app.use()

  Proxy `connect#use()` to apply settings to
  mounted applications.

# app.engine()

  Register the given template engine callback `fn`
  as `ext`. For example if you wanted to map the EJS
  template engine to ".html" files, rather than ".ejs" files,
  you could do the following.
  
      app.engine('html', require('ejs').renderFile);
  
  In this case EJS provides a `.renderFile()` method with
  the same signature that Express expects: `(path, options, callback)`.
  
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

