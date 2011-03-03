
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