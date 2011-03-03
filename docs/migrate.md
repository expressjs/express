
### Express 1.x to 2.x Migration

### HTTPS

 Creating an HTTPS server is simply, simply pass the TLS options to _express.createServer()_:
 
     var app = express.createServer({
         key: ...
       , cert: ...
     });

     app.listen(443);

### req.header() Referrer

 Previously if anyone was doing something similar to:
 
     req.headers.referrer || req.headers.referer
     req.header('Referrer') || req.header('Referer')

 With the new special-case we may now simply use _Referrer_ which will return either if defined:
 
     req.header('Referrer')

### res.local(name, val)

 Previously all local variables had to be passed to _res.render()_, or either _app.helpers()_ or _app.dynamicHelpers()_, now we may do this at the request-level progressively. The _res.local()_ method accepts a _name_ and _val_, however the locals passed to _res.render()_ will take precedence.

 For example we may utilize this feature to create locals in middleware:

     function loadUser(req, res, next) {
       User.get(req.params.id, function(err, user){
         res.local('user', user);
         next();
       });
     }

     app.get('/user/:id', loadUser, function(req, res){
       res.render('user');
     });

### req.param(name[, defaultValue])

 Previously only _name_ was accepted, so some of you may have been doing the following:
 
     var id = req.param('id') || req.user.id;

 The new _defaultValue_ argument can handle this nicely:
 
     var id = req.param('id', req.user.id);

### app.helpers() / app.locals()

  _app.locals()_ is now an alias of _app.helpers()_, as helpers makes more sense for functions.

### req.accepts(type)

  _req.accepts()_ now accepts extensions:
  
  
      // Accept: text/html
      req.accepts('html');
      req.accepts('.html');
      // => true
      
      // Accept: text/*; application/json
      req.accepts('html');
      req.accepts('text/*');
      req.accepts('text/plain');
      req.accepts('application/json');
      // => true
      
      req.accepts('image/png');
      req.accepts('png');
      // => false

### res.cookie()

 Previously only directly values could be passed, so for example:

    res.cookie('rememberme', 'yes', { expires: new Date(Date.now() + 900000), httpOnly: true });

However now we have the alternative _maxAge_ property which may be used to set _expires_ relative to _Date.now()_ in milliseconds, so our example above can now become:

    res.cookie('rememberme', 'yes', { maxAge: 900000 });

### res.download() / res.sendfile()

 Both of these methods now utilize Connect's static file server behind the scenes (actually the previous Express code was ported to Connect 1.0). With this change comes a change to the callback as well. Previously the _path_ and _stream_ were passed, however now only an _error_ is passed, when no error has occurred the callback will be invoked indicating that the file transfer is complete. The callback remains optional:
 
     res.download('/path/to/file');

     res.download('/path/to/file', function(err){
       if (err) {
         console.error(err);
       } else {
         console.log('transferred');
       }
     });

 The _stream threshold_ setting was removed.

### View Engine Compliance

 To comply with Express previously engines needed the following signature:
 
     engine.render(str, options, function(err){});

 Now they must export a _compile()_ function, returning a function which when called with local variables will render the template. This allows Express to cache the compiled function in memory during production.
 
     var fn = engine.compile(str, options);
     fn(locals);

### View Partial Lookup

 Previously partials were loaded relative to the now removed _view partials_ directory setting, or by default _views/partials_, now they are relative to the view calling them, read more on [view lookup](guide.html#View-Lookup).

### Mime Types

 Express and Connect now utilize the _mime_ module in npm, so to add more use:
 
     require('mime').define({ 'foo/bar': ['foo', 'bar'] });