# TOC
   - [app.all()](#appall)
   - [app.del()](#appdel)
   - [app](#app)
     - [.engine(ext, fn)](#engineext-fn)
     - [.locals(obj)](#localsobj)
     - [.locals.settings](#localssettings)
     - [.locals.use(fn)](#localsusefn)
       - [with arity < 3](#with-arity--3)
     - [.param(fn)](#paramfn)
     - [.param(names, fn)](#paramnames-fn)
     - [.param(name, fn)](#paramname-fn)
     - [.render(name, fn)](#rendername-fn)
       - [when an error occurs](#when-an-error-occurs)
       - [when an extension is given](#when-an-extension-is-given)
       - [when "view engine" is given](#when-view-engine-is-given)
     - [.render(name, options, fn)](#rendername-options-fn)
     - [.request](#request)
     - [.response](#response)
     - [.use(app)](#useapp)
   - [HEAD](#head)
   - [app.head()](#apphead)
   - [app.parent](#appparent)
   - [app.route](#approute)
   - [app.path()](#apppath)
   - [in development](#in-development)
   - [in production](#in-production)
   - [app.listen()](#applisten)
   - [OPTIONS](#options)
   - [app.options()](#appoptions)
   - [app.router](#approuter)
     - [methods supported](#methods-supported)
     - [when given a regexp](#when-given-a-regexp)
     - [when given an array](#when-given-an-array)
     - [case sensitivity](#case-sensitivity)
       - [when "case sensitive routing" is enabled](#when-case-sensitive-routing-is-enabled)
     - [trailing slashes](#trailing-slashes)
       - [when "strict routing" is enabled](#when-strict-routing-is-enabled)
     - [*](#)
     - [:name](#name)
     - [:name?](#name)
     - [.:name](#name)
     - [.:name?](#name)
     - [when next() is called](#when-next-is-called)
     - [when next(err) is called](#when-nexterr-is-called)
   - [config](#config)
     - [.configure()](#configure)
       - [when no env is given](#when-no-env-is-given)
       - [when an env is given](#when-an-env-is-given)
       - [when several envs are given](#when-several-envs-are-given)
     - [.set()](#set)
     - [.get()](#get)
       - [when mounted](#when-mounted)
     - [.enable()](#enable)
     - [.disable()](#disable)
     - [.enabled()](#enabled)
     - [.disabled()](#disabled)
   - [exports](#exports)
   - [throw after .end()](#throw-after-end)
   - [req](#req)
     - [.accepted](#accepted)
       - [when Accept is not present](#when-accept-is-not-present)
     - [.acceptedCharsets](#acceptedcharsets)
       - [when Accept-Charset is not present](#when-accept-charset-is-not-present)
     - [.acceptedLanguages](#acceptedlanguages)
       - [when Accept-Language is not present](#when-accept-language-is-not-present)
     - [.accepts(type)](#acceptstype)
     - [.acceptsCharset(type)](#acceptscharsettype)
       - [when Accept-Charset is not present](#when-accept-charset-is-not-present)
     - [.cookies](#cookies)
     - [.fresh](#fresh)
     - [.get(field)](#getfield)
     - [.param(name, default)](#paramname-default)
     - [.param(name)](#paramname)
     - [.path](#path)
     - [.protocol](#protocol)
       - [when "trust proxy" is enabled](#when-trust-proxy-is-enabled)
       - [when "trust proxy" is disabled](#when-trust-proxy-is-disabled)
     - [.query](#query)
     - [.route](#route)
     - [.signedCookies](#signedcookies)
       - [when signature is invalid](#when-signature-is-invalid)
     - [.stale](#stale)
     - [.subdomains](#subdomains)
       - [when present](#when-present)
       - [otherwise](#otherwise)
     - [.xhr](#xhr)
     - [.format(obj)](#formatobj)
       - [with canonicalized mime types](#with-canonicalized-mime-types)
         - [when Accept is not present](#when-accept-is-not-present)
         - [when no match is made](#when-no-match-is-made)
       - [with extnames](#with-extnames)
         - [when Accept is not present](#when-accept-is-not-present)
         - [when no match is made](#when-no-match-is-made)
   - [req.is()](#reqis)
     - [when content-type is not present](#when-content-type-is-not-present)
     - [when given an extension](#when-given-an-extension)
     - [when given a mime type](#when-given-a-mime-type)
     - [when given */subtype](#when-given-subtype)
       - [with a charset](#with-a-charset)
     - [when given type/*](#when-given-type)
       - [with a charset](#with-a-charset)
   - [res](#res)
     - [.attachment()](#attachment)
     - [.attachment(filename)](#attachmentfilename)
     - [.cache(type)](#cachetype)
       - [maxAge option](#maxage-option)
     - [.charset](#charset)
     - [.clearCookie(name)](#clearcookiename)
     - [.clearCookie(name, options)](#clearcookiename-options)
     - [.cookie(name, object)](#cookiename-object)
     - [.cookie(name, string)](#cookiename-string)
     - [.cookie(name, string, options)](#cookiename-string-options)
       - [maxAge](#maxage)
     - [.get(field)](#getfield)
     - [.json(object)](#jsonobject)
       - [when given primitives](#when-given-primitives)
       - [when given an object](#when-given-an-object)
       - ["json replacer" setting](#json-replacer-setting)
       - ["json spaces" setting](#json-spaces-setting)
     - [.json(status, object)](#jsonstatus-object)
     - [.locals(obj)](#localsobj)
     - [.redirect(url)](#redirecturl)
       - [with leading /](#with-leading-)
       - [with leading ./](#with-leading-)
       - [with leading ../](#with-leading-)
       - [without leading /](#without-leading-)
       - [when mounted](#when-mounted)
         - [deeply](#deeply)
         - [omitting leading /](#omitting-leading-)
         - [providing leading /](#providing-leading-)
     - [.redirect(status, url)](#redirectstatus-url)
     - [when the request method is HEAD](#when-the-request-method-is-head)
     - [when accepting html](#when-accepting-html)
     - [when accepting text](#when-accepting-text)
     - [.render(name)](#rendername)
       - [when an error occurs](#when-an-error-occurs)
       - [when "view engine" is given](#when-view-engine-is-given)
     - [.render(name, option)](#rendername-option)
     - [.render(name, options, fn)](#rendername-options-fn)
     - [.render(name, fn)](#rendername-fn)
       - [when an error occurs](#when-an-error-occurs)
     - [.send(null)](#sendnull)
     - [.send(undefined)](#sendundefined)
     - [.send(code)](#sendcode)
     - [.send(code, body)](#sendcode-body)
     - [.send(String)](#sendstring)
     - [.send(Buffer)](#sendbuffer)
     - [.send(Object)](#sendobject)
     - [when .statusCode is 204](#when-statuscode-is-204)
     - [when .statusCode is 304](#when-statuscode-is-304)
     - [.sendfile(path, fn)](#sendfilepath-fn)
     - [.sendfile(path)](#sendfilepath)
       - [with an absolute path](#with-an-absolute-path)
       - [with a relative path](#with-a-relative-path)
         - [with non-GET](#with-non-get)
     - [.set(field, value)](#setfield-value)
     - [.set(object)](#setobject)
     - [.signedCook(name, object)](#signedcookname-object)
     - [.signedCookie(name, string)](#signedcookiename-string)
     - [.status(code)](#statuscode)
     - [.type(str)](#typestr)
   - [Router](#router)
     - [.match(req, i)](#matchreq-i)
     - [.middleware](#middleware)
   - [utils.isAbsolute()](#utilsisabsolute)
   - [utils.flatten(arr)](#utilsflattenarr)
   - [utils.escape(html)](#utilsescapehtml)
   - [utils.parseQuality(str)](#utilsparsequalitystr)
   - [utils.parseAccept(str)](#utilsparseacceptstr)
   - [utils.accepts(type, str)](#utilsacceptstype-str)
     - [when a string is not given](#when-a-string-is-not-given)
     - [when a string is empty](#when-a-string-is-empty)
     - [when */* is given](#when--is-given)
     - [when accepting type/subtype](#when-accepting-typesubtype)
     - [when accepting */subtype](#when-accepting-subtype)
     - [when accepting type/*](#when-accepting-type)
     - [when an extension is given](#when-an-extension-is-given)
<a name="" />
 
<a name="appall" />
# app.all()
should add a router per method.

```js
var app = express();

app.all('/tobi', function(req, res){
  res.end(req.method);
});

request(app)
.put('/tobi')
.expect('PUT', function(){
  request(app)
  .get('/tobi')
  .expect('GET', done);
});
```

should .

```js
var app = express()
  , n = 0;

app.all('/*', function(req, res, next){
  if (n++) return done(new Error('DELETE called several times'));
  next();
});

request(app)
.delete('/tobi')
.expect(404, done);
```

<a name="appdel" />
# app.del()
should alias app.delete().

```js
var app = express();

app.del('/tobi', function(req, res){
  res.end('deleted tobi!');
});

request(app)
.delete('/tobi')
.expect('deleted tobi!', done);
```

<a name="app" />
# app
<a name="app-engineext-fn" />
## .engine(ext, fn)
should map a template engine.

```js
var app = express();

app.set('views', __dirname + '/fixtures');
app.engine('.html', render);
app.locals.user = { name: 'tobi' };

app.render('user.html', function(err, str){
  if (err) return done(err);
  str.should.equal('<p>tobi</p>');
  done();
})
```

should work without leading ".".

```js
var app = express();

app.set('views', __dirname + '/fixtures');
app.engine('html', render);
app.locals.user = { name: 'tobi' };

app.render('user.html', function(err, str){
  if (err) return done(err);
  str.should.equal('<p>tobi</p>');
  done();
})
```

should work "view engine" setting.

```js
var app = express();

app.set('views', __dirname + '/fixtures');
app.engine('html', render);
app.set('view engine', 'html');
app.locals.user = { name: 'tobi' };

app.render('user', function(err, str){
  if (err) return done(err);
  str.should.equal('<p>tobi</p>');
  done();
})
```

<a name="head" />
# HEAD
should default to GET.

```js
var app = express();

app.get('/tobi', function(req, res){
  // send() detects HEAD
  res.send('tobi');
});

request(app)
.head('/tobi')
.expect(200, done);
```

<a name="apphead" />
# app.head()
should override.

```js
var app = express()
  , called;

app.head('/tobi', function(req, res){
  called = true;
  res.end('');
});

app.get('/tobi', function(req, res){
  assert(0, 'should not call GET');
  res.send('tobi');
});

request(app)
.head('/tobi')
.expect(200, function(){
  assert(called);
  done();
});
```

<a name="app" />
# app
should inherit from event emitter.

```js
var app = express();
app.on('foo', done);
app.emit('foo');
```

<a name="appparent" />
# app.parent
should return the parent when mounted.

```js
var app = express()
  , blog = express()
  , blogAdmin = express();

app.use('/blog', blog);
blog.use('/admin', blogAdmin);

assert(!app.parent, 'app.parent');
blog.parent.should.equal(app);
blogAdmin.parent.should.equal(blog);
```

<a name="approute" />
# app.route
should return the mounted path.

```js
var app = express()
  , blog = express()
  , blogAdmin = express();

app.use('/blog', blog);
blog.use('/admin', blogAdmin);

app.route.should.equal('/');
blog.route.should.equal('/blog');
blogAdmin.route.should.equal('/admin');
```

<a name="apppath" />
# app.path()
should return the canonical.

```js
var app = express()
  , blog = express()
  , blogAdmin = express();

app.use('/blog', blog);
blog.use('/admin', blogAdmin);

app.path().should.equal('');
blog.path().should.equal('/blog');
blogAdmin.path().should.equal('/blog/admin');
```

<a name="in-development" />
# in development
should disable "view cache".

```js
var app = express();
app.enabled('view cache').should.be.false;
```

<a name="in-production" />
# in production
should enable "view cache".

```js
process.env.NODE_ENV = 'production';
var app = express();
app.enabled('view cache').should.be.true;
process.env.NODE_ENV = 'test';
```

<a name="applisten" />
# app.listen()
should wrap with an HTTP server.

```js
var app = express();

app.del('/tobi', function(req, res){
  res.end('deleted tobi!');
});

var server = app.listen(9999, function(){
  server.close();
  done();
});
```

<a name="app" />
# app
<a name="app-localsobj" />
## .locals(obj)
should merge locals.

```js
var app = express();
Object.keys(app.locals).should.eql(['use', 'settings']);
app.locals({ user: 'tobi', age: 1 });
app.locals({ age: 2 });
Object.keys(app.locals).should.eql(['use', 'settings', 'user', 'age']);
app.locals.user.should.equal('tobi');
app.locals.age.should.equal(2);
```

<a name="app-localssettings" />
## .locals.settings
should expose app settings.

```js
var app = express();
app.set('title', 'House of Manny');
var obj = app.locals.settings;
obj.should.have.property('env', 'test');
obj.should.have.property('title', 'House of Manny');
```

<a name="app" />
# app
<a name="app-localsusefn" />
## .locals.use(fn)
should run in parallel on res.render().

```js
var app = express();
var calls = [];
app.set('views', __dirname + '/fixtures');

app.locals.first = 'tobi';

app.locals.use(function(req, res, done){
  process.nextTick(function(){
    calls.push('one');
    res.locals.last = 'holowaychuk';
    done();
  });
});

app.locals.use(function(req, res, done){
  process.nextTick(function(){
    calls.push('two');
    res.locals.species = 'ferret';
    done();
  });
});

app.use(function(req, res){
  calls.push('use');
  res.render('pet.jade');
});

request(app)
.get('/')
.end(function(res){
  calls.should.eql(['use', 'one', 'two']);
  res.body.should.equal('<p>tobi holowaychuk is a ferret</p>');
  done();
})
```

should not override res.render() locals.

```js
var app = express();

app.set('views', __dirname + '/fixtures');
app.locals.first = 'tobi';

app.locals.use(function(req, res){
  res.locals.last = 'holowaychuk';
  res.locals.species = 'ferret';
});

app.use(function(req, res){
  res.render('pet.jade', { last: 'ibot' });
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('<p>tobi ibot is a ferret</p>');
  done();
})
```

<a name="app-localsusefn-with-arity--3" />
### with arity < 3
should done() for you.

```js
var app = express();

app.set('views', __dirname + '/fixtures');
app.locals.first = 'tobi';

app.locals.use(function(req, res){
  res.locals.last = 'holowaychuk';
  res.locals.species = 'ferret';
});

app.use(function(req, res){
  res.render('pet.jade');
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('<p>tobi holowaychuk is a ferret</p>');
  done();
})
```

<a name="options" />
# OPTIONS
should default to the routes defined.

```js
var app = express();

app.del('/', function(){});
app.get('/users', function(req, res){});
app.put('/users', function(req, res){});

request(app)
.options('/users')
.end(function(res){
  res.body.should.equal('GET,PUT');
  res.headers.should.have.property('content-type');
  res.headers.should.have.property('allow', 'GET,PUT');
  done();
});
```

<a name="appoptions" />
# app.options()
should override the default behavior.

```js
var app = express();

app.options('/users', function(req, res){
  res.set('Allow', 'GET');
  res.send('GET');
});

app.get('/users', function(req, res){});
app.put('/users', function(req, res){});

request(app)
.options('/users')
.end(function(res){
  res.body.should.equal('GET');
  res.headers.should.have.property('allow', 'GET');
  done();
});
```

<a name="app" />
# app
<a name="app-paramfn" />
## .param(fn)
should map app.param(name, ...) logic.

```js
var app = express();

app.param(function(name, regexp){
  if (regexp instanceof RegExp) {
    return function(req, res, next, val){
      var captures;
      if (captures = regexp.exec(String(val))) {
        req.params[name] = captures[1];
        next();
      } else {
        next('route');
      }
    }
  }
})

app.param(':name', /^([a-zA-Z]+)$/);

app.get('/user/:name', function(req, res){
  res.send(req.params.name);
});

request(app)
.get('/user/tj')
.end(function(res){
  res.body.should.equal('tj');
  request(app)
  .get('/user/123')
  .end(function(res){
    res.should.have.status(404);
    done();
  });
});
```

<a name="app-paramnames-fn" />
## .param(names, fn)
should map the array.

```js
var app = express();

app.param(['id', 'uid'], function(req, res, next, id){
  id = Number(id);
  if (isNaN(id)) return next('route');
  req.params.id = id;
  next();
});

app.get('/post/:id', function(req, res){
  var id = req.params.id;
  id.should.be.a('number');
  res.send('' + id);
});

app.get('/user/:uid', function(req, res){
  var id = req.params.id;
  id.should.be.a('number');
  res.send('' + id);
});

request(app)
.get('/user/123')
.end(function(res){
  res.body.should.equal('123');

  request(app)
  .get('/post/123')
  .end(function(res){
    res.body.should.equal('123');
    done();
  })
})
```

<a name="app-paramname-fn" />
## .param(name, fn)
should map logic for a single param.

```js
var app = express();

app.param('id', function(req, res, next, id){
  id = Number(id);
  if (isNaN(id)) return next('route');
  req.params.id = id;
  next();
});

app.get('/user/:id', function(req, res){
  var id = req.params.id;
  id.should.be.a('number');
  res.send('' + id);
});

request(app)
.get('/user/123')
.end(function(res){
  res.body.should.equal('123');
  done();
})
```

<a name="app" />
# app
<a name="app-rendername-fn" />
## .render(name, fn)
should support absolute paths.

```js
var app = express();

app.locals.user = { name: 'tobi' };

app.render(__dirname + '/fixtures/user.jade', function(err, str){
  if (err) return done(err);
  str.should.equal('<p>tobi</p>');
  done();
})
```

should support absolute paths with "view engine".

```js
var app = express();

app.set('view engine', 'jade');
app.locals.user = { name: 'tobi' };

app.render(__dirname + '/fixtures/user', function(err, str){
  if (err) return done(err);
  str.should.equal('<p>tobi</p>');
  done();
})
```

should expose app.locals.

```js
var app = express();

app.set('views', __dirname + '/fixtures');
app.locals.user = { name: 'tobi' };

app.render('user.jade', function(err, str){
  if (err) return done(err);
  str.should.equal('<p>tobi</p>');
  done();
})
```

should support index.<engine>.

```js
var app = express();

app.set('views', __dirname + '/fixtures');
app.set('view engine', 'jade');

app.render('blog/post', function(err, str){
  if (err) return done(err);
  str.should.equal('<h1>blog post</h1>');
  done();
})
```

<a name="app-rendername-fn-when-an-error-occurs" />
### when an error occurs
should invoke the callback.

```js
var app = express();

app.set('views', __dirname + '/fixtures');

app.render('user.jade', function(err, str){
  // nextTick to prevent cyclic
  process.nextTick(function(){
    err.message.should.match(/user is not defined/);
    done();
  });
})
```

<a name="app-rendername-fn-when-an-extension-is-given" />
### when an extension is given
should render the template.

```js
var app = express();

app.set('views', __dirname + '/fixtures');

app.render('email.jade', function(err, str){
  if (err) return done(err);
  str.should.equal('<p>This is an email</p>');
  done();
})
```

<a name="app-rendername-fn-when-view-engine-is-given" />
### when "view engine" is given
should render the template.

```js
var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/fixtures');

app.render('email', function(err, str){
  if (err) return done(err);
  str.should.equal('<p>This is an email</p>');
  done();
})
```

<a name="app-rendername-options-fn" />
## .render(name, options, fn)
should render the template.

```js
var app = express();

app.set('views', __dirname + '/fixtures');

var user = { name: 'tobi' };

app.render('user.jade', { user: user }, function(err, str){
  if (err) return done(err);
  str.should.equal('<p>tobi</p>');
  done();
})
```

should expose app.locals.

```js
var app = express();

app.set('views', __dirname + '/fixtures');
app.locals.user = { name: 'tobi' };

app.render('user.jade', {}, function(err, str){
  if (err) return done(err);
  str.should.equal('<p>tobi</p>');
  done();
})
```

should give precedence to app.render() locals.

```js
var app = express();

app.set('views', __dirname + '/fixtures');
app.locals.user = { name: 'tobi' };
var jane = { name: 'jane' };

app.render('user.jade', { user: jane }, function(err, str){
  if (err) return done(err);
  str.should.equal('<p>jane</p>');
  done();
})
```

<a name="app" />
# app
<a name="app-request" />
## .request
should extend the request prototype.

```js
var app = express();

app.request.querystring = function(){
  return require('url').parse(this.url).query;
};

app.use(function(req, res){
  res.end(req.querystring());
});

request(app)
.get('/foo?name=tobi')
.end(function(res){
  res.body.should.equal('name=tobi');
  done();
});
```

<a name="app" />
# app
<a name="app-response" />
## .response
should extend the response prototype.

```js
var app = express();

app.response.shout = function(str){
  this.send(str.toUpperCase());
};

app.use(function(req, res){
  res.shout('hey');
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('HEY');
  done();
});
```

should not be influenced by other app protos.

```js
var app = express()
  , app2 = express();

app.response.shout = function(str){
  this.send(str.toUpperCase());
};

app2.response.shout = function(str){
  this.send(str);
};

app.use(function(req, res){
  res.shout('hey');
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('HEY');
  done();
});
```

<a name="approuter" />
# app.router
should be .use()able.

```js
var app = express();

var calls = [];

app.use(function(req, res, next){
  calls.push('before');
  next();
});

app.use(app.router);

app.use(function(req, res, next){
  calls.push('after');
  res.end();
});

app.get('/', function(req, res, next){
  calls.push('GET /')
  next();
});

request(app)
.get('/')
.end(function(res){
  calls.should.eql(['before', 'GET /', 'after'])
  done();
})
```

should be auto .use()d on the first app.VERB() call.

```js
var app = express();

var calls = [];

app.use(function(req, res, next){
  calls.push('before');
  next();
});

app.get('/', function(req, res, next){
  calls.push('GET /')
  next();
});

app.use(function(req, res, next){
  calls.push('after');
  res.end();
});

request(app)
.get('/')
.end(function(res){
  calls.should.eql(['before', 'GET /', 'after'])
  done();
})
```

should allow escaped regexp.

```js
var app = express();

app.get('/user/\\d+', function(req, res){
  res.end('woot');
});

request(app)
.get('/user/10')
.end(function(res){
  res.statusCode.should.equal(200);
  request(app)
  .get('/user/tj')
  .expect(404, done);
});
```

should allow literal ".".

```js
var app = express();

app.get('/api/users/:from..:to', function(req, res){
  var from = req.params.from
    , to = req.params.to;

  res.end('users from ' + from + ' to ' + to);
});

request(app)
.get('/api/users/1..50')
.expect('users from 1 to 50', done);
```

<a name="approuter-methods-supported" />
## methods supported
should include GET.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include POST.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include PUT.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include HEAD.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include DELETE.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include OPTIONS.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include TRACE.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include COPY.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include LOCK.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include MKCOL.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include MOVE.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include PROPFIND.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include PROPPATCH.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include UNLOCK.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include REPORT.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include MKACTIVITY.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include CHECKOUT.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include MERGE.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include M-SEARCH.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include NOTIFY.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include SUBSCRIBE.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include UNSUBSCRIBE.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

should include PATCH.

```js
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
  if ('head' == method) {
    res.end();
  } else {
    res.end(method);
  }
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
```

<a name="approuter-when-given-a-regexp" />
## when given a regexp
should match the pathname only.

```js
var app = express();

app.get(/^\/user\/[0-9]+$/, function(req, res){
  res.end('user');
});

request(app)
.get('/user/12?foo=bar')
.expect('user', done);
```

should populate req.params with the captures.

```js
var app = express();

app.get(/^\/user\/([0-9]+)\/(view|edit)?$/, function(req, res){
  var id = req.params.shift()
    , op = req.params.shift();
  res.end(op + 'ing user ' + id);
});

request(app)
.get('/user/10/edit')
.expect('editing user 10', done);
```

<a name="approuter-when-given-an-array" />
## when given an array
should match all paths in the array.

```js
			var app = express();
			
			app.get(['/one', '/two'], function(req, res){
				res.end('works');
			});
			
			request(app)
			.get('/one')
			.expect('works', function() {
				request(app)
				.get('/two')
				.expect('works', done);
			});
```

<a name="approuter-case-sensitivity" />
## case sensitivity
should be disabled by default.

```js
var app = express();

app.get('/user', function(req, res){
  res.end('tj');
});

request(app)
.get('/USER')
.expect('tj', done);
```

<a name="approuter-case-sensitivity-when-case-sensitive-routing-is-enabled" />
### when "case sensitive routing" is enabled
should match identical casing.

```js
var app = express();

app.enable('case sensitive routing');

app.get('/uSer', function(req, res){
  res.end('tj');
});

request(app)
.get('/uSer')
.expect('tj', done);
```

should not match otherwise.

```js
var app = express();

app.enable('case sensitive routing');

app.get('/uSer', function(req, res){
  res.end('tj');
});

request(app)
.get('/user')
.expect(404, done);
```

<a name="approuter-trailing-slashes" />
## trailing slashes
should be optional by default.

```js
var app = express();

app.get('/user', function(req, res){
  res.end('tj');
});

request(app)
.get('/user/')
.expect('tj', done);
```

<a name="approuter-trailing-slashes-when-strict-routing-is-enabled" />
### when "strict routing" is enabled
should match trailing slashes.

```js
var app = express();

app.enable('strict routing');

app.get('/user/', function(req, res){
  res.end('tj');
});

request(app)
.get('/user/')
.expect('tj', done);
```

should match no slashes.

```js
var app = express();

app.enable('strict routing');

app.get('/user', function(req, res){
  res.end('tj');
});

request(app)
.get('/user')
.expect('tj', done);
```

should fail when omitting the trailing slash.

```js
var app = express();

app.enable('strict routing');

app.get('/user/', function(req, res){
  res.end('tj');
});

request(app)
.get('/user')
.expect(404, done);
```

should fail when adding the trailing slash.

```js
var app = express();

app.enable('strict routing');

app.get('/user', function(req, res){
  res.end('tj');
});

request(app)
.get('/user/')
.expect(404, done);
```

<a name="approuter-" />
## *
should denote a greedy capture group.

```js
var app = express();

app.get('/user/*.json', function(req, res){
  res.end(req.params[0]);
});

request(app)
.get('/user/tj.json')
.expect('tj', done);
```

should work with several.

```js
var app = express();

app.get('/api/*.*', function(req, res){
  var resource = req.params.shift()
    , format = req.params.shift();
  res.end(resource + ' as ' + format);
});

request(app)
.get('/api/users/0.json')
.expect('users/0 as json', done);
```

should allow naming.

```js
var app = express();

app.get('/api/:resource(*)', function(req, res){
  var resource = req.params.resource;
  res.end(resource);
});

request(app)
.get('/api/users/0.json')
.expect('users/0.json', done);
```

should span multiple segments.

```js
var app = express();

app.get('/file/*', function(req, res){
  res.end(req.params[0]);
});

request(app)
.get('/file/javascripts/jquery.js')
.expect('javascripts/jquery.js', done);
```

should be optional.

```js
var app = express();

app.get('/file/*', function(req, res){
  res.end(req.params[0]);
});

request(app)
.get('/file/')
.expect('', done);
```

should require a preceeding /.

```js
var app = express();

app.get('/file/*', function(req, res){
  res.end(req.params[0]);
});

request(app)
.get('/file')
.expect(404, done);
```

<a name="approuter-name" />
## :name
should denote a capture group.

```js
var app = express();

app.get('/user/:user', function(req, res){
  res.end(req.params.user);
});

request(app)
.get('/user/tj')
.expect('tj', done);
```

should match a single segment only.

```js
var app = express();

app.get('/user/:user', function(req, res){
  res.end(req.params.user);
});

request(app)
.get('/user/tj/edit')
.expect(404, done);
```

should allow several capture groups.

```js
var app = express();

app.get('/user/:user/:op', function(req, res){
  res.end(req.params.op + 'ing ' + req.params.user);
});

request(app)
.get('/user/tj/edit')
.expect('editing tj', done);
```

<a name="approuter-name" />
## :name?
should denote an optional capture group.

```js
var app = express();

app.get('/user/:user/:op?', function(req, res){
  var op = req.params.op || 'view';
  res.end(op + 'ing ' + req.params.user);
});

request(app)
.get('/user/tj')
.expect('viewing tj', done);
```

should populate the capture group.

```js
var app = express();

app.get('/user/:user/:op?', function(req, res){
  var op = req.params.op || 'view';
  res.end(op + 'ing ' + req.params.user);
});

request(app)
.get('/user/tj/edit')
.expect('editing tj', done);
```

<a name="approuter-name" />
## .:name
should denote a format.

```js
var app = express();

app.get('/:name.:format', function(req, res){
  res.end(req.params.name + ' as ' + req.params.format);
});

request(app)
.get('/foo.json')
.expect('foo as json', function(){
  request(app)
  .get('/foo')
  .expect(404, done);
});
```

<a name="approuter-name" />
## .:name?
should denote an optional format.

```js
var app = express();

app.get('/:name.:format?', function(req, res){
  res.end(req.params.name + ' as ' + (req.params.format || 'html'));
});

request(app)
.get('/foo')
.expect('foo as html', function(){
  request(app)
  .get('/foo.json')
  .expect('foo as json', done);
});
```

<a name="approuter-when-next-is-called" />
## when next() is called
should continue lookup.

```js
var app = express()
  , calls = [];

app.get('/foo/:bar?', function(req, res, next){
  calls.push('/foo/:bar?');
  next();
});

app.get('/bar', function(req, res){
  assert(0);
});

app.get('/foo', function(req, res, next){
  calls.push('/foo');
  next();
});

app.get('/foo', function(req, res, next){
  calls.push('/foo 2');
  res.end('done');
});

request(app)
.get('/foo')
.expect('done', function(){
  calls.should.eql(['/foo/:bar?', '/foo', '/foo 2']);
  done();
})
```

<a name="approuter-when-nexterr-is-called" />
## when next(err) is called
should break out of app.router.

```js
var app = express()
  , calls = [];

app.get('/foo/:bar?', function(req, res, next){
  calls.push('/foo/:bar?');
  next();
});

app.get('/bar', function(req, res){
  assert(0);
});

app.get('/foo', function(req, res, next){
  calls.push('/foo');
  next(new Error('fail'));
});

app.get('/foo', function(req, res, next){
  assert(0);
});

app.use(function(err, req, res, next){
  res.end(err.message);
})

request(app)
.get('/foo')
.expect('fail', function(){
  calls.should.eql(['/foo/:bar?', '/foo']);
  done();
})
```

<a name="app" />
# app
should emit "mount" when mounted.

```js
var blog = express()
  , app = express();

blog.on('mount', function(arg){
  arg.should.equal(app);
  done();
});

app.use(blog);
```

<a name="app-useapp" />
## .use(app)
should mount the app.

```js
var blog = express()
  , app = express();

blog.get('/blog', function(req, res){
  res.end('blog');
});

app.use(blog);

request(app)
.get('/blog')
.expect('blog', done);
```

should support mount-points.

```js
var blog = express()
  , forum = express()
  , app = express();

blog.get('/', function(req, res){
  res.end('blog');
});

forum.get('/', function(req, res){
  res.end('forum');
});

app.use('/blog', blog);
app.use('/forum', forum);

request(app)
.get('/blog')
.expect('blog', function(){
  request(app)
  .get('/forum')
  .expect('forum', done);
});
```

should set the child's .parent.

```js
var blog = express()
  , app = express();

app.use('/blog', blog);
blog.parent.should.equal(app);
```

<a name="config" />
# config
<a name="config-configure" />
## .configure()
should execute in order as defined.

```js
var app = express();
var calls = [];

app.configure(function(){
  calls.push('all');
});

app.configure('test', function(){
  calls.push('test');
});

app.configure(function(){
  calls.push('all 2');
});

app.configure('test', function(){
  calls.push('test 2');
});

calls.should.eql(['all', 'test', 'all 2', 'test 2'])
```

<a name="config-configure-when-no-env-is-given" />
### when no env is given
should always execute.

```js
var app = express();
var calls = [];

app.configure(function(){
  calls.push('all');
});

app.configure('test', function(){
  calls.push('test');
});

app.configure('test', function(){
  calls.push('test 2');
});

calls.should.eql(['all', 'test', 'test 2'])
```

<a name="config-configure-when-an-env-is-given" />
### when an env is given
should only execute the matching env.

```js
var app = express();
var calls = [];

app.set('env', 'development');

app.configure('development', function(){
  calls.push('dev');
});

app.configure('test', function(){
  calls.push('test');
});

calls.should.eql(['dev']);
```

<a name="config-configure-when-several-envs-are-given" />
### when several envs are given
should execute when matching one.

```js
var app = express();
var calls = [];

app.set('env', 'development');

app.configure('development', function(){
  calls.push('dev');
});

app.configure('test', 'development', function(){
  calls.push('dev 2');
});

app.configure('development', 'test', function(){
  calls.push('dev 3');
});

app.configure('test', function(){
  calls.push('dev 3');
});

calls.should.eql(['dev', 'dev 2', 'dev 3']);
```

<a name="config" />
# config
<a name="config-set" />
## .set()
should set a value.

```js
var app = express();
app.set('foo', 'bar').should.equal(app);
```

should return the app when undefined.

```js
var app = express();
app.set('foo', undefined).should.equal(app);
```

<a name="config-get" />
## .get()
should return undefined when unset.

```js
var app = express();
assert(undefined === app.get('foo'));
```

should otherwise return the value.

```js
var app = express();
app.set('foo', 'bar');
app.get('foo').should.equal('bar');
```

<a name="config-get-when-mounted" />
### when mounted
should default to the parent app.

```js
var app = express()
  , blog = express();

app.set('title', 'Express');
app.use(blog);
blog.get('title').should.equal('Express');
```

should given precedence to the child.

```js
var app = express()
  , blog = express();

app.use(blog);
app.set('title', 'Express');
blog.set('title', 'Some Blog');

blog.get('title').should.equal('Some Blog');
```

<a name="config-enable" />
## .enable()
should set the value to true.

```js
var app = express();
app.enable('tobi').should.equal(app);
app.get('tobi').should.be.true;
```

<a name="config-disable" />
## .disable()
should set the value to false.

```js
var app = express();
app.disable('tobi').should.equal(app);
app.get('tobi').should.be.false;
```

<a name="config-enabled" />
## .enabled()
should default to false.

```js
var app = express();
app.enabled('foo').should.be.false;
```

should return true when set.

```js
var app = express();
app.set('foo', 'bar');
app.enabled('foo').should.be.true;
```

<a name="config-disabled" />
## .disabled()
should default to true.

```js
var app = express();
app.disabled('foo').should.be.true;
```

should return false when set.

```js
var app = express();
app.set('foo', 'bar');
app.disabled('foo').should.be.false;
```

<a name="exports" />
# exports
should have .version.

```js
express.should.have.property('version');
```

should expose connect middleware.

```js
express.should.have.property('bodyParser');
express.should.have.property('session');
express.should.have.property('static');
```

should expose HTTP methods.

```js
express.methods.should.be.an.instanceof(Array);
express.methods.should.include('get');
express.methods.should.include('put');
express.methods.should.include('post');
```

should expose Router.

```js
express.Router.should.be.a('function');
```

should expose the application prototype.

```js
express.application.set.should.be.a('function');
```

should expose the request prototype.

```js
express.request.accepts.should.be.a('function');
```

should expose the response prototype.

```js
express.response.send.should.be.a('function');
```

should permit modifying the .application prototype.

```js
express.application.foo = function(){ return 'bar'; };
express().foo().should.equal('bar');
```

should permit modifying the .request prototype.

```js
express.request.foo = function(){ return 'bar'; };
var app = express();

app.use(function(req, res, next){
  res.end(req.foo());
});

request(app)
.get('/')
.expect('bar', done);
```

should permit modifying the .response prototype.

```js
express.response.foo = function(){ this.send('bar'); };
var app = express();

app.use(function(req, res, next){
  res.foo();
});

request(app)
.get('/')
.expect('bar', done);
```

<a name="throw-after-end" />
# throw after .end()
should fail gracefully.

```js
var app = express();

app.get('/', function(req, res){
  res.end('yay');
  throw new Error('boom');
});

request(app)
.get('/')
.end(function(res){
  res.should.have.status(200);
  res.body.should.equal('yay');
  done();
});
```

<a name="req" />
# req
<a name="req-accepted" />
## .accepted
should return an array of accepted media types.

```js
var app = express();

app.use(function(req, res){
  req.accepted[0].value.should.equal('application/json');
  req.accepted[1].value.should.equal('text/html');
  res.end();
});

request(app)
.get('/')
.set('Accept', 'text/html;q=.5, application/json')
.expect(200, done);
```

<a name="req-accepted-when-accept-is-not-present" />
### when Accept is not present
should default to [].

```js
var app = express();

app.use(function(req, res){
  req.accepted.should.have.length(0);
  res.end();
});

request(app)
.get('/')
.expect(200, done);
```

<a name="req" />
# req
<a name="req-acceptedcharsets" />
## .acceptedCharsets
should return an array of accepted charsets.

```js
var app = express();

app.use(function(req, res){
  req.acceptedCharsets[0].should.equal('unicode-1-1');
  req.acceptedCharsets[1].should.equal('iso-8859-5');
  res.end();
});

request(app)
.get('/')
.set('Accept-Charset', 'iso-8859-5;q=.2, unicode-1-1;q=0.8')
.expect(200, done);
```

<a name="req-acceptedcharsets-when-accept-charset-is-not-present" />
### when Accept-Charset is not present
should default to [].

```js
var app = express();

app.use(function(req, res){
  req.acceptedCharsets.should.have.length(0);
  res.end();
});

request(app)
.get('/')
.expect(200, done);
```

<a name="req" />
# req
<a name="req-acceptedlanguages" />
## .acceptedLanguages
should return an array of accepted languages.

```js
var app = express();

app.use(function(req, res){
  req.acceptedLanguages[0].should.equal('en-us');
  req.acceptedLanguages[1].should.equal('en');
  res.end();
});

request(app)
.get('/')
.set('Accept-Language', 'en;q=.5, en-us')
.expect(200, done);
```

<a name="req-acceptedlanguages-when-accept-language-is-not-present" />
### when Accept-Language is not present
should default to [].

```js
var app = express();

app.use(function(req, res){
  req.acceptedLanguages.should.have.length(0);
  res.end();
});

request(app)
.get('/')
.expect(200, done);
```

<a name="req" />
# req
<a name="req-acceptstype" />
## .accepts(type)
should return true when Accept is not present.

```js
var app = express();

app.use(function(req, res, next){
  res.end(req.accepts('json') ? 'yes' : 'no');
});

request(app)
.get('/')
.expect('yes', done);
```

should return true when present.

```js
var app = express();

app.use(function(req, res, next){
  res.end(req.accepts('json') ? 'yes' : 'no');
});

request(app)
.get('/')
.set('Accept', 'application/json')
.expect('yes', done);
```

should return false otherwise.

```js
var app = express();

app.use(function(req, res, next){
  res.end(req.accepts('json') ? 'yes' : 'no');
});

request(app)
.get('/')
.set('Accept', 'text/html')
.expect('no', done);
```

<a name="req" />
# req
<a name="req-acceptscharsettype" />
## .acceptsCharset(type)
<a name="req-acceptscharsettype-when-accept-charset-is-not-present" />
### when Accept-Charset is not present
should return true.

```js
var app = express();

app.use(function(req, res, next){
  res.end(req.acceptsCharset('utf-8') ? 'yes' : 'no');
});

request(app)
.get('/')
.expect('yes', done);
```

<a name="req-acceptscharsettype-when-accept-charset-is-not-present" />
### when Accept-Charset is not present
should return true when present.

```js
var app = express();

app.use(function(req, res, next){
  res.end(req.acceptsCharset('utf-8') ? 'yes' : 'no');
});

request(app)
.get('/')
.set('Accept-Charset', 'foo, bar, utf-8')
.expect('yes', done);
```

should return false otherwise.

```js
var app = express();

app.use(function(req, res, next){
  res.end(req.acceptsCharset('utf-8') ? 'yes' : 'no');
});

request(app)
.get('/')
.set('Accept-Charset', 'foo, bar')
.expect('no', done);
```

<a name="req" />
# req
<a name="req-cookies" />
## .cookies
should expose cookie data.

```js
var app = express();

app.use(express.cookieParser());

app.use(function(req, res){
  res.end(req.cookies.name + ' ' + req.cookies.species);
});

request(app)
.get('/')
.set('Cookie', 'name=tobi; species=ferret')
.end(function(res){
  res.body.should.equal('tobi ferret');
  done();
})
```

should parse JSON cookies.

```js
var app = express();

app.use(express.cookieParser());

app.use(function(req, res){
  res.end(req.cookies.user.name);
});

request(app)
.get('/')
.set('Cookie', 'user=j%3A%7B%22name%22%3A%22tobi%22%7D')
.end(function(res){
  res.body.should.equal('tobi');
  done();
})
```

<a name="req" />
# req
<a name="req-fresh" />
## .fresh
should return true when the resource is not modified.

```js
var app = express();

app.use(function(req, res){
  res.set('ETag', '12345');
  res.send(req.fresh);
});

request(app)
.get('/')
.set('If-None-Match', '12345')
.end(function(res){
  res.body.should.equal('true');
  done();
});
```

should return false when the resource is modified.

```js
var app = express();

app.use(function(req, res){
  res.set('ETag', '123');
  res.send(req.fresh);
});

request(app)
.get('/')
.set('If-None-Match', '12345')
.end(function(res){
  res.body.should.equal('false');
  done();
});
```

<a name="req" />
# req
<a name="req-getfield" />
## .get(field)
should return the header field value.

```js
var app = express();

app.use(function(req, res){
  res.end(req.get('Content-Type'));
});

request(app)
.post('/')
.set('Content-Type', 'application/json')
.end(function(res){
  res.body.should.equal('application/json');
  done();
});
```

should special-case Referer.

```js
var app = express();

app.use(function(req, res){
  res.end(req.get('Referer'));
});

request(app)
.post('/')
.set('Referrer', 'http://foobar.com')
.end(function(res){
  res.body.should.equal('http://foobar.com');
  done();
});
```

<a name="reqis" />
# req.is()
should ignore charset.

```js
req('application/json; charset=utf-8')
.is('json')
.should.be.true;
```

<a name="reqis-when-content-type-is-not-present" />
## when content-type is not present
should return false.

```js
req('')
.is('json')
.should.be.false;
```

<a name="reqis-when-given-an-extension" />
## when given an extension
should lookup the mime type.

```js
req('application/json')
.is('json')
.should.be.true;

req('text/html')
.is('json')
.should.be.false;
```

<a name="reqis-when-given-a-mime-type" />
## when given a mime type
should match.

```js
req('application/json')
.is('application/json')
.should.be.true;

req('image/jpeg')
.is('application/json')
.should.be.false;
```

<a name="reqis-when-given-subtype" />
## when given */subtype
should match.

```js
req('application/json')
.is('*/json')
.should.be.true;

req('image/jpeg')
.is('*/json')
.should.be.false;
```

<a name="reqis-when-given-subtype-with-a-charset" />
### with a charset
should match.

```js
req('text/html; charset=utf-8')
.is('*/html')
.should.be.true;

req('text/plain; charset=utf-8')
.is('*/html')
.should.be.false;
```

<a name="reqis-when-given-type" />
## when given type/*
should match.

```js
req('image/png')
.is('image/*')
.should.be.true;

req('text/html')
.is('image/*')
.should.be.false;
```

<a name="reqis-when-given-type-with-a-charset" />
### with a charset
should match.

```js
req('text/html; charset=utf-8')
.is('text/*')
.should.be.true;

req('something/html; charset=utf-8')
.is('text/*')
.should.be.false;
```

<a name="req" />
# req
<a name="req-paramname-default" />
## .param(name, default)
should use the default value unless defined.

```js
var app = express();

app.use(function(req, res){
  res.end(req.param('name', 'tj'));
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('tj');
  done();
})
```

<a name="req-paramname" />
## .param(name)
should check req.query.

```js
var app = express();

app.use(function(req, res){
  res.end(req.param('name'));
});

request(app)
.get('/?name=tj')
.end(function(res){
  res.body.should.equal('tj');
  done();
})
```

should check req.body.

```js
var app = express();

app.use(express.bodyParser());

app.use(function(req, res){
  res.end(req.param('name'));
});

request(app)
.post('/')
.set('Content-Type', 'application/json')
.write('{"name":"tj"}')
.end(function(res){
  res.body.should.equal('tj');
  done();
})
```

should check req.params.

```js
var app = express();

app.get('/user/:name', function(req, res){
  res.end(req.param('name'));
});

request(app)
.get('/user/tj')
.end(function(res){
  res.body.should.equal('tj');
  done();
})
```

<a name="req" />
# req
<a name="req-path" />
## .path
should return the parsed pathname.

```js
var app = express();

app.use(function(req, res){
  res.end(req.path);
});

request(app)
.get('/login?redirect=/post/1/comments')
.end(function(res){
  res.body.should.equal('/login');
  done();
})
```

<a name="req" />
# req
<a name="req-protocol" />
## .protocol
should return the protocol string.

```js
var app = express();

app.use(function(req, res){
  res.end(req.protocol);
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('http');
  done();
})
```

<a name="req-protocol-when-trust-proxy-is-enabled" />
### when "trust proxy" is enabled
should respect X-Forwarded-Proto.

```js
var app = express();

app.enable('trust proxy');

app.use(function(req, res){
  res.end(req.protocol);
});

request(app)
.get('/')
.set('X-Forwarded-Proto', 'https')
.end(function(res){
  res.body.should.equal('https');
  done();
})
```

should default to http.

```js
var app = express();

app.enable('trust proxy');

app.use(function(req, res){
  res.end(req.protocol);
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('http');
  done();
})
```

<a name="req-protocol-when-trust-proxy-is-disabled" />
### when "trust proxy" is disabled
should ignore X-Forwarded-Proto.

```js
var app = express();

app.use(function(req, res){
  res.end(req.protocol);
});

request(app)
.get('/')
.set('X-Forwarded-Proto', 'https')
.end(function(res){
  res.body.should.equal('http');
  done();
})
```

<a name="req" />
# req
<a name="req-query" />
## .query
should default to {}.

```js
var app = express();

app.use(function(req, res){
  req.query.should.eql({});
  res.end();
});

request(app)
.get('/')
.end(function(res){
  done();
});
```

should contain the parsed query-string.

```js
var app = express();

app.use(function(req, res){
  req.query.should.eql({ user: { name: 'tj' }});
  res.end();
});

request(app)
.get('/?user[name]=tj')
.end(function(res){
  done();
});
```

<a name="req" />
# req
<a name="req-route" />
## .route
should be the executed Route.

```js
var app = express();

app.get('/user/:id/:op?', function(req, res, next){
  req.route.method.should.equal('get');
  req.route.path.should.equal('/user/:id/:op?');
  next();
});

app.get('/user/:id/edit', function(req, res){
  req.route.method.should.equal('get');
  req.route.path.should.equal('/user/:id/edit');
  res.end();
});

request(app)
.get('/user/12/edit')
.expect(200, done);
```

<a name="req" />
# req
<a name="req-signedcookies" />
## .signedCookies
should unsign cookies.

```js
var app = express();

app.use(express.cookieParser('foo bar baz'));

app.use(function(req, res){
  req.cookies.should.not.have.property('name');
  res.end(req.signedCookies.name);
});

request(app)
.get('/')
.set('Cookie', 'name=tobi.2HDdGQqJ6jQU1S9dagggYDPaxGE')
.end(function(res){
  res.body.should.equal('tobi');
  done();
})
```

should parse JSON cookies.

```js
var app = express();

app.use(express.cookieParser('foo bar baz'));

app.use(function(req, res){
  req.cookies.should.not.have.property('user');
  res.end(req.signedCookies.user.name);
});

request(app)
.get('/')
.set('Cookie', 'user=j%3A%7B%22name%22%3A%22tobi%22%7D.aEbp4PGZo63zMX%2FcIMSn2M9pvms')
.end(function(res){
  res.body.should.equal('tobi');
  done();
})
```

<a name="req-signedcookies-when-signature-is-invalid" />
### when signature is invalid
should unsign cookies.

```js
var app = express();

app.use(express.cookieParser('foo bar baz'));

app.use(function(req, res){
  req.signedCookies.should.not.have.property('name');
  res.end(req.cookies.name);
});

request(app)
.get('/')
.set('Cookie', 'name=tobi.2HDdGQqJ6jQU1S9dagasdfasdf')
.end(function(res){
  res.body.should.equal('tobi.2HDdGQqJ6jQU1S9dagasdfasdf');
  done();
})
```

<a name="req" />
# req
<a name="req-stale" />
## .stale
should return false when the resource is not modified.

```js
var app = express();

app.use(function(req, res){
  res.set('ETag', '12345');
  res.send(req.stale);
});

request(app)
.get('/')
.set('If-None-Match', '12345')
.end(function(res){
  res.body.should.equal('false');
  done();
});
```

should return true when the resource is modified.

```js
var app = express();

app.use(function(req, res){
  res.set('ETag', '123');
  res.send(req.stale);
});

request(app)
.get('/')
.set('If-None-Match', '12345')
.end(function(res){
  res.body.should.equal('true');
  done();
});
```

<a name="req" />
# req
<a name="req-subdomains" />
## .subdomains
<a name="req-subdomains-when-present" />
### when present
should return an array.

```js
var app = express();

app.use(function(req, res){
  res.send(req.subdomains);
});

request(app)
.get('/')
.set('Host', 'tobi.ferrets.example.com')
.end(function(res){
  res.body.should.equal('["ferrets","tobi"]');
  done();
})
```

<a name="req-subdomains-otherwise" />
### otherwise
should return an empty array.

```js
var app = express();

app.use(function(req, res){
  res.send(req.subdomains);
});

request(app)
.get('/')
.set('Host', 'example.com')
.end(function(res){
  res.body.should.equal('[]');
  done();
})
```

<a name="req" />
# req
<a name="req-xhr" />
## .xhr
should return true when X-Requested-With is xmlhttprequest.

```js
var app = express();

app.use(function(req, res){
  req.xhr.should.be.true;
  res.end();
});

request(app)
.get('/')
.set('X-Requested-With', 'xmlhttprequest')
.end(function(res){
  done();
})
```

should case-insensitive.

```js
var app = express();

app.use(function(req, res){
  req.xhr.should.be.true;
  res.end();
});

request(app)
.get('/')
.set('X-Requested-With', 'XMLHttpRequest')
.end(function(res){
  done();
})
```

should return false otherwise.

```js
var app = express();

app.use(function(req, res){
  req.xhr.should.be.false;
  res.end();
});

request(app)
.get('/')
.set('X-Requested-With', 'blahblah')
.end(function(res){
  done();
})
```

should return false when not present.

```js
var app = express();

app.use(function(req, res){
  req.xhr.should.be.false;
  res.end();
});

request(app)
.get('/')
.end(function(res){
  done();
})
```

<a name="res" />
# res
<a name="res-attachment" />
## .attachment()
should Content-Disposition to attachment.

```js
var app = express();

app.use(function(req, res){
  res.attachment().send('foo');
});

request(app)
.get('/')
.end(function(res){
  res.headers.should.have.property('content-disposition', 'attachment');
  done();
})
```

<a name="res-attachmentfilename" />
## .attachment(filename)
should add the filename param.

```js
var app = express();

app.use(function(req, res){
  res.attachment('/path/to/image.png');
  res.send('foo');
});

request(app)
.get('/')
.end(function(res){
  res.headers.should.have.property('content-disposition', 'attachment; filename="image.png"');
  done();
})
```

should set the Content-Type.

```js
var app = express();

app.use(function(req, res){
  res.attachment('/path/to/image.png');
  res.send('foo');
});

request(app)
.get('/')
.end(function(res){
  res.headers.should.have.property('content-type', 'image/png');
  done();
})
```

<a name="res" />
# res
<a name="res-cachetype" />
## .cache(type)
should set Cache-Control.

```js
var app = express();

app.use(function(req, res){
  res.cache('public').end('whoop');
});

request(app)
.get('/')
.end(function(res){
  res.headers['cache-control'].should.equal('public');
  res.body.should.equal('whoop');
  done();
})
```

<a name="res-cachetype-maxage-option" />
### maxAge option
should accept milliseconds.

```js
var app = express();

app.use(function(req, res){
  res.cache('private', { maxAge: 60 * 1000 }).end();
});

request(app)
.get('/')
.end(function(res){
  res.headers['cache-control'].should.equal('private, max-age=60');
  done();
})
```

<a name="res" />
# res
<a name="res-charset" />
## .charset
should add the charset param to Content-Type.

```js
var app = express();

app.use(function(req, res){
  res.charset = 'utf-8';
  res.set('Content-Type', 'text/x-foo');
  res.end(res.get('Content-Type'));
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('text/x-foo; charset=utf-8');
  done();
})
```

should take precedence over res.send() defaults.

```js
var app = express();

app.use(function(req, res){
  res.charset = 'whoop';
  res.send('hey');
});

request(app)
.get('/')
.end(function(res){
  res.headers.should.have.property('content-type', 'text/html; charset=whoop');
  done();
})
```

<a name="res" />
# res
<a name="res-clearcookiename" />
## .clearCookie(name)
should set a cookie passed expiry.

```js
var app = express();

app.use(function(req, res){
  res.clearCookie('sid').end();
});

request(app)
.get('/')
.end(function(res){
  var val = 'sid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  res.headers['set-cookie'].should.eql([val]);
  done();
})
```

<a name="res-clearcookiename-options" />
## .clearCookie(name, options)
should set the given params.

```js
var app = express();

app.use(function(req, res){
  res.clearCookie('sid', { path: '/admin' }).end();
});

request(app)
.get('/')
.end(function(res){
  var val = 'sid=; path=/admin; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  res.headers['set-cookie'].should.eql([val]);
  done();
})
```

<a name="res" />
# res
<a name="res-cookiename-object" />
## .cookie(name, object)
should generate a JSON cookie.

```js
var app = express();

app.use(function(req, res){
  res.cookie('user', { name: 'tobi' }).end();
});

request(app)
.get('/')
.end(function(res){
  var val = ['user=j%3A%7B%22name%22%3A%22tobi%22%7D; path=/'];
  res.headers['set-cookie'].should.eql(val);
  done();
})
```

<a name="res-cookiename-string" />
## .cookie(name, string)
should set a cookie.

```js
var app = express();

app.use(function(req, res){
  res.cookie('name', 'tobi').end();
});

request(app)
.get('/')
.end(function(res){
  var val = ['name=tobi; path=/'];
  res.headers['set-cookie'].should.eql(val);
  done();
})
```

should allow multiple calls.

```js
var app = express();

app.use(function(req, res){
  res.cookie('name', 'tobi');
  res.cookie('age', 1);
  res.end();
});

request(app)
.get('/')
.end(function(res){
  var val = ['name=tobi; path=/', 'age=1; path=/'];
  res.headers['set-cookie'].should.eql(val);
  done();
})
```

<a name="res-cookiename-string-options" />
## .cookie(name, string, options)
should set params.

```js
var app = express();

app.use(function(req, res){
  res.cookie('name', 'tobi', { httpOnly: true, secure: true });
  res.end();
});

request(app)
.get('/')
.end(function(res){
  var val = ['name=tobi; path=/; httpOnly; secure'];
  res.headers['set-cookie'].should.eql(val);
  done();
})
```

<a name="res-cookiename-string-options-maxage" />
### maxAge
should set relative expires.

```js
var app = express();

app.use(function(req, res){
  res.cookie('name', 'tobi', { maxAge: 1000 });
  res.end();
});

request(app)
.get('/')
.end(function(res){
  res.headers['set-cookie'][0].should.not.include('Thu, 01 Jan 1970 00:00:01 GMT');
  done();
})
```

<a name="req" />
# req
<a name="req-formatobj" />
## .format(obj)
<a name="req-formatobj-with-canonicalized-mime-types" />
### with canonicalized mime types
should utilize qvalues in negotiation.

```js
request(app)
.get('/')
.set('Accept', 'text/html; q=.5, application/json, */*; q=.1')
.expect('{"message":"hey"}', done);
```

should allow wildcard type/subtypes.

```js
request(app)
.get('/')
.set('Accept', 'text/html; q=.5, application/*, */*; q=.1')
.expect('{"message":"hey"}', done);
```

should default the Content-Type.

```js
request(app)
.get('/')
.set('Accept', 'text/html; q=.5, text/plain')
.end(function(res){
  res.headers['content-type'].should.equal('text/plain');
  res.body.should.equal('hey');
  done();
});
```

<a name="req-formatobj-with-canonicalized-mime-types-when-accept-is-not-present" />
#### when Accept is not present
should invoke the first callback.

```js
request(app)
.get('/')
.expect('hey', done);
```

<a name="req-formatobj-with-canonicalized-mime-types-when-no-match-is-made" />
#### when no match is made
should should respond with 406 not acceptable.

```js
request(app)
.get('/')
.set('Accept', 'foo/bar')
.end(function(res){
  res.should.have.status(406);
  res.body.should.equal('Supports: text/plain, text/html, application/json');
  done();
});
```

<a name="req-formatobj-with-extnames" />
### with extnames
should utilize qvalues in negotiation.

```js
request(app)
.get('/')
.set('Accept', 'text/html; q=.5, application/json, */*; q=.1')
.expect('{"message":"hey"}', done);
```

should allow wildcard type/subtypes.

```js
request(app)
.get('/')
.set('Accept', 'text/html; q=.5, application/*, */*; q=.1')
.expect('{"message":"hey"}', done);
```

should default the Content-Type.

```js
request(app)
.get('/')
.set('Accept', 'text/html; q=.5, text/plain')
.end(function(res){
  res.headers['content-type'].should.equal('text/plain');
  res.body.should.equal('hey');
  done();
});
```

<a name="req-formatobj-with-extnames-when-accept-is-not-present" />
#### when Accept is not present
should invoke the first callback.

```js
request(app)
.get('/')
.expect('hey', done);
```

<a name="req-formatobj-with-extnames-when-no-match-is-made" />
#### when no match is made
should should respond with 406 not acceptable.

```js
request(app)
.get('/')
.set('Accept', 'foo/bar')
.end(function(res){
  res.should.have.status(406);
  res.body.should.equal('Supports: text/plain, text/html, application/json');
  done();
});
```

<a name="res" />
# res
<a name="res-getfield" />
## .get(field)
should get the response header field.

```js
var app = express();

app.use(function(req, res){
  res.setHeader('Content-Type', 'text/x-foo');
  res.end(res.get('Content-Type'));
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('text/x-foo');
  done();
})
```

<a name="res" />
# res
<a name="res-jsonobject" />
## .json(object)
<a name="res-jsonobject-when-given-primitives" />
### when given primitives
should respond with json.

```js
var app = express();

app.use(function(req, res){
  res.json(null);
});

request(app)
.get('/')
.end(function(res){
  res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
  res.body.should.equal('null');
  done();
})
```

<a name="res-jsonobject-when-given-an-object" />
### when given an object
should respond with json.

```js
var app = express();

app.use(function(req, res){
  res.json({ name: 'tobi' });
});

request(app)
.get('/')
.end(function(res){
  res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
  res.body.should.equal('{"name":"tobi"}');
  done();
})
```

<a name="res-jsonobject-json-replacer-setting" />
### "json replacer" setting
should be passed to JSON.stringify().

```js
var app = express();

app.set('json replacer', function(key, val){
  return '_' == key[0]
    ? undefined
    : val;
});

app.use(function(req, res){
  res.json({ name: 'tobi', _id: 12345 });
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('{"name":"tobi"}');
  done();
});
```

<a name="res-jsonobject-json-spaces-setting" />
### "json spaces" setting
should default to 2 in development.

```js
process.env.NODE_ENV = 'development';
var app = express();
app.get('json spaces').should.equal(2);
process.env.NODE_ENV = 'test';
```

should be undefined otherwise.

```js
var app = express();
assert(undefined === app.get('json spaces'));
```

should be passed to JSON.stringify().

```js
var app = express();

app.set('json spaces', 2);

app.use(function(req, res){
  res.json({ name: 'tobi', age: 2 });
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('{\n  "name": "tobi",\n  "age": 2\n}');
  done();
});
```

<a name="res-jsonstatus-object" />
## .json(status, object)
should respond with json and set the .statusCode.

```js
var app = express();

app.use(function(req, res){
  res.json(201, { id: 1 });
});

request(app)
.get('/')
.end(function(res){
  res.statusCode.should.equal(201);
  res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
  res.body.should.equal('{"id":1}');
  done();
})
```

<a name="res" />
# res
<a name="res-localsobj" />
## .locals(obj)
should merge locals.

```js
var app = express();

app.use(function(req, res){
  Object.keys(res.locals).should.eql([]);
  res.locals({ user: 'tobi', age: 1 });
  res.locals.user.should.equal('tobi');
  res.locals.age.should.equal(1);
  res.end();
});

request(app)
.get('/')
.end(function(res){
  done();
})
```

<a name="res" />
# res
<a name="res-redirecturl" />
## .redirect(url)
should respect X-Forwarded-Proto when "trust proxy" is enabled.

```js
var app = express();

app.enable('trust proxy');

app.use(function(req, res){
  res.redirect('/login');
});

request(app)
.get('/')
.set('Host', 'example.com')
.set('X-Forwarded-Proto', 'https')
.end(function(res){
  res.statusCode.should.equal(302);
  res.headers.should.have.property('location', 'https://example.com/login');
  done();
})
```

should default to a 302 redirect.

```js
var app = express();

app.use(function(req, res){
  res.redirect('http://google.com');
});

request(app)
.get('/')
.end(function(res){
  res.statusCode.should.equal(302);
  res.headers.should.have.property('location', 'http://google.com');
  done();
})
```

<a name="res-redirecturl-with-leading-" />
### with leading /
should construct host-relative urls.

```js
var app = express();

app.use(function(req, res){
  res.redirect('/login');
});

request(app)
.get('/')
.set('Host', 'example.com')
.end(function(res){
  res.headers.should.have.property('location', 'http://example.com/login');
  done();
})
```

<a name="res-redirecturl-with-leading-" />
### with leading ./
should construct path-relative urls.

```js
var app = express();

app.use(function(req, res){
  res.redirect('./edit');
});

request(app)
.get('/post/1')
.set('Host', 'example.com')
.end(function(res){
  res.headers.should.have.property('location', 'http://example.com/post/1/./edit');
  done();
})
```

<a name="res-redirecturl-with-leading-" />
### with leading ../
should construct path-relative urls.

```js
var app = express();

app.use(function(req, res){
  res.redirect('../new');
});

request(app)
.get('/post/1')
.set('Host', 'example.com')
.end(function(res){
  res.headers.should.have.property('location', 'http://example.com/post/1/../new');
  done();
})
```

<a name="res-redirecturl-without-leading-" />
### without leading /
should construct mount-point relative urls.

```js
var app = express();

app.use(function(req, res){
  res.redirect('login');
});

request(app)
.get('/')
.set('Host', 'example.com')
.end(function(res){
  res.headers.should.have.property('location', 'http://example.com/login');
  done();
})
```

<a name="res-redirecturl-when-mounted" />
### when mounted
<a name="res-redirecturl-when-mounted-deeply" />
#### deeply
should respect the mount-point.

```js
var app = express()
  , blog = express()
  , admin = express();

admin.use(function(req, res){
  res.redirect('login');
});

app.use('/blog', blog);
blog.use('/admin', admin);

request(app)
.get('/blog/admin')
.set('Host', 'example.com')
.end(function(res){
  res.headers.should.have.property('location', 'http://example.com/blog/admin/login');
  done();
})
```

<a name="res-redirecturl-when-mounted-omitting-leading-" />
#### omitting leading /
should respect the mount-point.

```js
var app = express()
  , admin = express();

admin.use(function(req, res){
  res.redirect('admin/login');
});

app.use('/blog', admin);

request(app)
.get('/blog')
.set('Host', 'example.com')
.end(function(res){
  res.headers.should.have.property('location', 'http://example.com/blog/admin/login');
  done();
})
```

<a name="res-redirecturl-when-mounted-providing-leading-" />
#### providing leading /
should ignore mount-point.

```js
var app = express()
  , admin = express();

admin.use(function(req, res){
  res.redirect('/admin/login');
});

app.use('/blog', admin);

request(app)
.get('/blog')
.set('Host', 'example.com')
.end(function(res){
  res.headers.should.have.property('location', 'http://example.com/admin/login');
  done();
})
```

<a name="res-redirectstatus-url" />
## .redirect(status, url)
should set the response status.

```js
var app = express();

app.use(function(req, res){
  res.redirect(303, 'http://google.com');
});

request(app)
.get('/')
.end(function(res){
  res.statusCode.should.equal(303);
  res.headers.should.have.property('location', 'http://google.com');
  done();
})
```

<a name="res-when-the-request-method-is-head" />
## when the request method is HEAD
should ignore the body.

```js
var app = express();

app.use(function(req, res){
  res.redirect('http://google.com');
});

request(app)
.head('/')
.end(function(res){
  res.headers.should.have.property('location', 'http://google.com');
  res.body.should.equal('');
  done();
})
```

<a name="res-when-accepting-html" />
## when accepting html
should respond with html.

```js
var app = express();

app.use(function(req, res){
  res.redirect('http://google.com');
});

request(app)
.get('/')
.set('Accept', 'text/html')
.end(function(res){
  res.headers.should.have.property('location', 'http://google.com');
  res.body.should.equal('<p>Moved Temporarily. Redirecting to <a href="http://google.com">http://google.com</a></p>');
  done();
})
```

<a name="res-when-accepting-text" />
## when accepting text
should respond with text.

```js
var app = express();

app.use(function(req, res){
  res.redirect('http://google.com');
});

request(app)
.get('/')
.set('Accept', 'text/plain, */*')
.end(function(res){
  res.headers.should.have.property('location', 'http://google.com');
  res.body.should.equal('Moved Temporarily. Redirecting to http://google.com');
  done();
})
```

<a name="res" />
# res
<a name="res-rendername" />
## .render(name)
should support absolute paths.

```js
var app = express();
  
app.locals.user = { name: 'tobi' };

app.use(function(req, res){
  res.render(__dirname + '/fixtures/user.jade');
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('<p>tobi</p>');
  done();
});
```

should support absolute paths with "view engine".

```js
var app = express();
  
app.locals.user = { name: 'tobi' };
app.set('view engine', 'jade');

app.use(function(req, res){
  res.render(__dirname + '/fixtures/user');
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('<p>tobi</p>');
  done();
});
```

should expose app.locals.

```js
var app = express();
  
app.set('views', __dirname + '/fixtures');
app.locals.user = { name: 'tobi' };

app.use(function(req, res){
  res.render('user.jade');
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('<p>tobi</p>');
  done();
});
```

should support index.<engine>.

```js
var app = express();
  
app.set('views', __dirname + '/fixtures');
app.set('view engine', 'jade');

app.use(function(req, res){
  res.render('blog/post');
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('<h1>blog post</h1>');
  done();
});
```

<a name="res-rendername-when-an-error-occurs" />
### when an error occurs
should next(err).

```js
var app = express();
  
app.set('views', __dirname + '/fixtures');

app.use(function(req, res){
  res.render('user.jade');
});

app.use(function(err, req, res, next){
  res.end(err.message);
});

request(app)
.get('/')
.end(function(res){
  res.body.should.match(/user is not defined/);
  done();
});
```

<a name="res-rendername-when-view-engine-is-given" />
### when "view engine" is given
should render the template.

```js
var app = express();
  
app.set('view engine', 'jade');
app.set('views', __dirname + '/fixtures');

app.use(function(req, res){
  res.render('email');
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('<p>This is an email</p>');
  done();
});
```

<a name="res-rendername-option" />
## .render(name, option)
should render the template.

```js
var app = express();
  
app.set('views', __dirname + '/fixtures');
  
var user = { name: 'tobi' };

app.use(function(req, res){
  res.render('user.jade', { user: user });
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('<p>tobi</p>');
  done();
});
```

should expose app.locals.

```js
var app = express();
    
app.set('views', __dirname + '/fixtures');
app.locals.user = { name: 'tobi' };

app.use(function(req, res){
  res.render('user.jade', {});
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('<p>tobi</p>');
  done();
});
```

should expose res.locals.

```js
var app = express();
    
app.set('views', __dirname + '/fixtures');

app.use(function(req, res){
  res.locals.user = { name: 'tobi' };
  res.render('user.jade', {});
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('<p>tobi</p>');
  done();
});
```

should give precedence to res.locals over app.locals.

```js
var app = express();
    
app.set('views', __dirname + '/fixtures');
app.locals.user = { name: 'tobi' };

app.use(function(req, res){
  res.locals.user = { name: 'jane' };
  res.render('user.jade', {});
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('<p>jane</p>');
  done();
});
```

should give precedence to res.render() locals over res.locals.

```js
var app = express();
    
app.set('views', __dirname + '/fixtures');
var jane = { name: 'jane' };
    
app.use(function(req, res){
  res.locals.user = { name: 'tobi' };
  res.render('user.jade', { user: jane });
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('<p>jane</p>');
  done();
});
```

should give precedence to res.render() locals over app.locals.

```js
var app = express();
    
app.set('views', __dirname + '/fixtures');
app.locals.user = { name: 'tobi' };
var jane = { name: 'jane' };
    
app.use(function(req, res){
  res.render('user.jade', { user: jane });
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('<p>jane</p>');
  done();
});
```

<a name="res-rendername-options-fn" />
## .render(name, options, fn)
should pass the resulting string.

```js
var app = express();

app.set('views', __dirname + '/fixtures');

app.use(function(req, res){
  var tobi = { name: 'tobi' };
  res.render('user.jade', { user: tobi }, function(err, html){
    html = html.replace('tobi', 'loki');
    res.end(html);
  });
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('<p>loki</p>');
  done();
});
```

<a name="res-rendername-fn" />
## .render(name, fn)
should pass the resulting string.

```js
var app = express();

app.set('views', __dirname + '/fixtures');

app.use(function(req, res){
  res.locals.user = { name: 'tobi' };
  res.render('user.jade', function(err, html){
    html = html.replace('tobi', 'loki');
    res.end(html);
  });
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('<p>loki</p>');
  done();
});
```

<a name="res-rendername-fn-when-an-error-occurs" />
### when an error occurs
should pass it to the callback.

```js
var app = express();

app.set('views', __dirname + '/fixtures');

app.use(function(req, res){
  res.render('user.jade', function(err){
    res.end(err.message);
  });
});

request(app)
.get('/')
.end(function(res){
  res.body.should.match(/is not defined/);
  done();
});
```

<a name="res" />
# res
<a name="res-sendnull" />
## .send(null)
should set body to "".

```js
var app = express();

app.use(function(req, res){
  res.send(null);
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('');
  done();
})
```

<a name="res-sendundefined" />
## .send(undefined)
should set body to "".

```js
var app = express();

app.use(function(req, res){
  res.send(undefined);
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('');
  done();
})
```

<a name="res-sendcode" />
## .send(code)
should set .statusCode.

```js
var app = express();

app.use(function(req, res){
  res.send(201).should.equal(res);
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('Created');
  res.statusCode.should.equal(201);
  done();
})
```

<a name="res-sendcode-body" />
## .send(code, body)
should set .statusCode and body.

```js
var app = express();

app.use(function(req, res){
  res.send(201, 'Created :)');
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('Created :)');
  res.statusCode.should.equal(201);
  done();
})
```

<a name="res-sendstring" />
## .send(String)
should send as html.

```js
var app = express();

app.use(function(req, res){
  res.send('<p>hey</p>');
});

request(app)
.get('/')
.end(function(res){
  res.headers.should.have.property('content-type', 'text/html; charset=utf-8');
  res.body.should.equal('<p>hey</p>');
  res.statusCode.should.equal(200);
  done();
})
```

should not override Content-Type.

```js
var app = express();

app.use(function(req, res){
  res.set('Content-Type', 'text/plain').send('hey');
});

request(app)
.get('/')
.end(function(res){
  res.headers.should.have.property('content-type', 'text/plain');
  res.body.should.equal('hey');
  res.statusCode.should.equal(200);
  done();
})
```

<a name="res-sendbuffer" />
## .send(Buffer)
should send as octet-stream.

```js
var app = express();

app.use(function(req, res){
  res.send(new Buffer('hello'));
});

request(app)
.get('/')
.end(function(res){
  res.headers.should.have.property('content-type', 'application/octet-stream');
  res.body.should.equal('hello');
  res.statusCode.should.equal(200);
  done();
})
```

should not override Content-Type.

```js
var app = express();

app.use(function(req, res){
  res.set('Content-Type', 'text/plain').send(new Buffer('hey'));
});

request(app)
.get('/')
.end(function(res){
  res.headers.should.have.property('content-type', 'text/plain');
  res.body.should.equal('hey');
  res.statusCode.should.equal(200);
  done();
})
```

<a name="res-sendobject" />
## .send(Object)
should send as application/json.

```js
var app = express();

app.use(function(req, res){
  res.send({ name: 'tobi' });
});

request(app)
.get('/')
.end(function(res){
  res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
  res.body.should.equal('{"name":"tobi"}');
  done();
})
```

<a name="res-when-the-request-method-is-head" />
## when the request method is HEAD
should ignore the body.

```js
var app = express();

app.use(function(req, res){
  res.send('yay');
});

request(app)
.head('/')
.end(function(res){
  res.body.should.equal('');
  done();
})
```

<a name="res-when-statuscode-is-204" />
## when .statusCode is 204
should strip Content-* fields & body.

```js
var app = express();

app.use(function(req, res){
  res.status(204).send('foo');
});

request(app)
.get('/')
.end(function(res){
  res.headers.should.not.have.property('content-type');
  res.headers.should.not.have.property('content-length');
  res.body.should.equal('');
  done();
})
```

<a name="res-when-statuscode-is-304" />
## when .statusCode is 304
should strip Content-* fields & body.

```js
var app = express();

app.use(function(req, res){
  res.status(304).send('foo');
});

request(app)
.get('/')
.end(function(res){
  res.headers.should.not.have.property('content-type');
  res.headers.should.not.have.property('content-length');
  res.body.should.equal('');
  done();
})
```

<a name="res" />
# res
<a name="res-sendfilepath-fn" />
## .sendfile(path, fn)
should invoke the callback when complete.

```js
var app = express()
  , calls = 0;

app.use(function(req, res){
  res.sendfile('test/fixtures/user.html', function(err){
    assert(!err);
    ++calls;
  });
});

request(app)
.get('/')
.end(function(res){
  calls.should.equal(1);
  res.statusCode.should.equal(200);
  done();
});
```

should invoke the callback on 404.

```js
var app = express()
  , calls = 0;

app.use(function(req, res){
  res.sendfile('test/fixtures/nope.html', function(err){
    assert(!res.headerSent);
    ++calls;
    res.send(err.message);
  });
});

request(app)
.get('/')
.end(function(res){
  calls.should.equal(1);
  res.body.should.equal('Not Found');
  res.statusCode.should.equal(200);
  done();
});
```

should not override manual content-types.

```js
var app = express();

app.use(function(req, res){
  res.contentType('txt');
  res.sendfile('test/fixtures/user.html');
});

request(app)
.get('/')
.end(function(res){
  res.should.have.header('content-type', 'text/plain');
  done();
});
```

should invoke the callback on 403.

```js
var app = express()
  , calls = 0;

app.use(function(req, res){
  res.sendfile('test/fixtures/foo/../user.html', function(err){
    assert(!res.headerSent);
    ++calls;
    res.send(err.message);
  });
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('Forbidden');
  res.statusCode.should.equal(200);
  calls.should.equal(1);
  done();
});
```

<a name="res-sendfilepath" />
## .sendfile(path)
<a name="res-sendfilepath-with-an-absolute-path" />
### with an absolute path
should transfer the file.

```js
var app = express();

app.use(function(req, res){
  res.sendfile(__dirname + '/fixtures/user.html');
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('<p>{{user.name}}</p>');
  res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
  done();
});
```

<a name="res-sendfilepath-with-a-relative-path" />
### with a relative path
should transfer the file.

```js
var app = express();

app.use(function(req, res){
  res.sendfile('test/fixtures/user.html');
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('<p>{{user.name}}</p>');
  res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
  done();
});
```

should serve relative to "root".

```js
var app = express();

app.use(function(req, res){
  res.sendfile('user.html', { root: 'test/fixtures/' });
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('<p>{{user.name}}</p>');
  res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
  done();
});
```

should consider ../ malicious when "root" is not set.

```js
var app = express();

app.use(function(req, res){
  res.sendfile('test/fixtures/foo/../user.html');
});

request(app)
.get('/')
.end(function(res){
  res.statusCode.should.equal(403);
  done();
});
```

should allow ../ when "root" is set.

```js
var app = express();

app.use(function(req, res){
  res.sendfile('foo/../user.html', { root: 'test/fixtures' });
});

request(app)
.get('/')
.end(function(res){
  res.statusCode.should.equal(200);
  done();
});
```

should disallow requesting out of "root".

```js
var app = express();

app.use(function(req, res){
  res.sendfile('foo/../../user.html', { root: 'test/fixtures' });
});

request(app)
.get('/')
.end(function(res){
  res.statusCode.should.equal(403);
  done();
});
```

should next(404) when not found.

```js
var app = express()
  , calls = 0;

app.use(function(req, res){
  res.sendfile('user.html');
});

app.use(function(req, res){
  assert(0, 'this should not be called');
});

app.use(function(err, req, res, next){
  ++calls;
  next(err);
});

request(app)
.get('/')
.end(function(res){
  res.statusCode.should.equal(404);
  calls.should.equal(1);
  done();
});
```

<a name="res-sendfilepath-with-a-relative-path-with-non-get" />
#### with non-GET
should still serve.

```js
var app = express()
   , calls = 0;

 app.use(function(req, res){
   res.sendfile(__dirname + '/fixtures/name.txt');
 });


 request(app)
 .get('/')
 .expect('tobi', done);
```

<a name="res" />
# res
<a name="res-setfield-value" />
## .set(field, value)
should set the response header field.

```js
var app = express();

app.use(function(req, res){
  res.set('Content-Type', 'text/x-foo').end();
});

request(app)
.get('/')
.end(function(res){
  res.headers.should.have.property('content-type', 'text/x-foo');
  done();
})
```

<a name="res-setobject" />
## .set(object)
should set multiple fields.

```js
var app = express();

app.use(function(req, res){
  res.set({
    'X-Foo': 'bar',
    'X-Bar': 'baz'
  }).end();
});

request(app)
.get('/')
.end(function(res){
  res.headers.should.have.property('x-foo', 'bar');
  res.headers.should.have.property('x-bar', 'baz');
  done();
})
```

<a name="res" />
# res
<a name="res-signedcookname-object" />
## .signedCook(name, object)
should generate a signed JSON cookie.

```js
var app = express();

app.use(express.cookieParser('foo bar baz'));

app.use(function(req, res){
  res.signedCookie('user', { name: 'tobi' }).end();
});
  
request(app)
.get('/')
.end(function(res){
  var val = ['user=j%3A%7B%22name%22%3A%22tobi%22%7D.aEbp4PGZo63zMX%2FcIMSn2M9pvms; path=/'];
  res.headers['set-cookie'].should.eql(val);
  done();
})
```

<a name="res-signedcookiename-string" />
## .signedCookie(name, string)
should set a signed cookie.

```js
var app = express();

app.use(express.cookieParser('foo bar baz'));

app.use(function(req, res){
  res.signedCookie('name', 'tobi').end();
});
  
request(app)
.get('/')
.end(function(res){
  var val = ['name=tobi.2HDdGQqJ6jQU1S9dagggYDPaxGE; path=/'];
  res.headers['set-cookie'].should.eql(val);
  done();
})
```

<a name="res" />
# res
<a name="res-statuscode" />
## .status(code)
should set the response .statusCode.

```js
var app = express();

app.use(function(req, res){
  res.status(201).end('Created');
});

request(app)
.get('/')
.end(function(res){
  res.body.should.equal('Created');
  res.statusCode.should.equal(201);
  done();
})
```

<a name="res" />
# res
<a name="res-typestr" />
## .type(str)
should set the Content-Type based on a filename.

```js
var app = express();

app.use(function(req, res){
  res.type('foo.js').end('var name = "tj";');
});

request(app)
.get('/')
.end(function(res){
  res.headers.should.have.property('content-type', 'application/javascript');
  done();
})
```

<a name="router" />
# Router
<a name="router-matchreq-i" />
## .match(req, i)
should match based on index.

```js
router.route('get', '/foo', function(){});
router.route('get', '/foob?', function(){});
router.route('get', '/bar', function(){});
var req = { method: 'GET', url: '/foo?bar=baz' };

var route = router.match(req, 0);
route.constructor.name.should.equal('Route');
route.method.should.equal('get');
route.path.should.equal('/foo');

var route = router.match(req, 1);
req._route_index.should.equal(1);
route.path.should.equal('/foob?');

var route = router.match(req, 2);
assert(!route);

req.url = '/bar';
var route = router.match(req);
route.path.should.equal('/bar');
```

<a name="router-middleware" />
## .middleware
should dispatch.

```js
router.route('get', '/foo', function(req, res){
  res.send('foo');
});

app.use(router.middleware);

request(app)
.get('/foo')
.expect('foo', done);
```

<a name="utilsisabsolute" />
# utils.isAbsolute()
should support windows.

```js
assert(utils.isAbsolute('c:\\'));
assert(!utils.isAbsolute(':\\'));
```

should unices.

```js
assert(utils.isAbsolute('/foo/bar'));
assert(!utils.isAbsolute('foo/bar'));
```

<a name="utilsflattenarr" />
# utils.flatten(arr)
should flatten an array.

```js
var arr = ['one', ['two', ['three', 'four'], 'five']];
utils.flatten(arr)
  .should.eql(['one', 'two', 'three', 'four', 'five']);
```

<a name="utilsescapehtml" />
# utils.escape(html)
should escape html entities.

```js
utils.escape('<script>foo & "bar"')
  .should.equal('&lt;script&gt;foo &amp; &quot;bar&quot;')
```

<a name="utilsparsequalitystr" />
# utils.parseQuality(str)
should default quality to 1.

```js
utils.parseQuality('text/html')
  .should.eql([{ value: 'text/html', quality: 1 }]);
```

should parse qvalues.

```js
utils.parseQuality('text/html; q=0.5')
  .should.eql([{ value: 'text/html', quality: 0.5 }]);

utils.parseQuality('text/html; q=.2')
  .should.eql([{ value: 'text/html', quality: 0.2 }]);
```

should work with messed up whitespace.

```js
utils.parseQuality('text/html   ;  q =   .2')
  .should.eql([{ value: 'text/html', quality: 0.2 }]);
```

should work with multiples.

```js
var str = 'da, en;q=.5, en-gb;q=.8';
var arr = utils.parseQuality(str);
arr[0].value.should.equal('da');
arr[1].value.should.equal('en-gb');
arr[2].value.should.equal('en');
```

should sort by quality.

```js
var str = 'text/plain;q=.2, application/json, text/html;q=0.5';
var arr = utils.parseQuality(str);
arr[0].value.should.equal('application/json');
arr[1].value.should.equal('text/html');
arr[2].value.should.equal('text/plain');
```

should exclude those with a quality of 0.

```js
var str = 'text/plain;q=.2, application/json, text/html;q=0';
var arr = utils.parseQuality(str);
arr.should.have.length(2);
```

<a name="utilsparseacceptstr" />
# utils.parseAccept(str)
should provide .type.

```js
var arr = utils.parseAccept('text/html');
arr[0].type.should.equal('text');
```

should provide .subtype.

```js
var arr = utils.parseAccept('text/html');
arr[0].subtype.should.equal('html');
```

<a name="utilsacceptstype-str" />
# utils.accepts(type, str)
<a name="utilsacceptstype-str-when-a-string-is-not-given" />
## when a string is not given
should return true.

```js
utils.accepts('text/html')
  .should.be.true;
```

<a name="utilsacceptstype-str-when-a-string-is-empty" />
## when a string is empty
should return true.

```js
utils.accepts('text/html', '')
  .should.be.true;
```

<a name="utilsacceptstype-str-when--is-given" />
## when */* is given
should return true.

```js
utils.accepts('text/html', 'text/plain, */*')
  .should.be.true;
```

<a name="utilsacceptstype-str-when-accepting-typesubtype" />
## when accepting type/subtype
should return true when present.

```js
utils.accepts('text/html', 'text/plain, text/html')
  .should.be.true;
```

should return false otherwise.

```js
utils.accepts('text/html', 'text/plain, application/json')
  .should.be.false;
```

<a name="utilsacceptstype-str-when-accepting-subtype" />
## when accepting */subtype
should return true when present.

```js
utils.accepts('text/html', 'text/*')
  .should.be.true;
```

should return false otherwise.

```js
utils.accepts('text/html', 'image/*')
  .should.be.false;
```

<a name="utilsacceptstype-str-when-accepting-type" />
## when accepting type/*
should return true when present.

```js
utils.accepts('text/html', '*/html')
  .should.be.true;
```

should return false otherwise.

```js
utils.accepts('text/html', '*/json')
  .should.be.false;
```

<a name="utilsacceptstype-str-when-an-extension-is-given" />
## when an extension is given
should return true when present.

```js
utils.accepts('html', 'text/html, application/json')
  .should.be.true;
```

should return false otherwise.

```js
utils.accepts('html', 'text/plain, application/json')
  .should.be.false;
```

should support *.

```js
utils.accepts('html', 'text/*')
  .should.be.true;

utils.accepts('html', '*/html')
  .should.be.true;
```

