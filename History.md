
2.4.7 / 2011-10-05 
==================

  * Added mkdirp to express(1). Closes #795
  * Added simple _json-config_ example
  * Added  shorthand for the parsed request's pathname via `req.path`
  * Changed connect dep to 1.7.x to fix npm issue...
  * Fixed `res.redirect()` __HEAD__ support. [reported by xerox]
  * Fixed `req.flash()`, only escape args
  * Fixed absolute path checking on windows. Closes #829 [reported by andrewpmckenzie]

2.4.6 / 2011-08-22 
==================

  * Fixed multiple param callback regression. Closes #824 [reported by TroyGoode]

2.4.5 / 2011-08-19 
==================

  * Added support for routes to handle errors. Closes #809
  * Added `app.routes.all()`. Closes #803
  * Added "basepath" setting to work in conjunction with reverse proxies etc.   
  * Refactored `Route` to use a single array of callbacks
  * Added support for multiple callbacks for `app.param()`. Closes #801
Closes #805
  * Changed: removed .call(self) for route callbacks
  * Dependency: `qs >= 0.3.1`
  * Fixed `res.redirect()` on windows due to `join()` usage. Closes #808

2.4.4 / 2011-08-05 
==================

  * Fixed `res.header()` intention of a set, even when `undefined`
  * Fixed `*`, value no longer required
  * Fixed `res.send(204)` support. Closes #771

2.4.3 / 2011-07-14 
==================

  * Added docs for `status` option special-case. Closes #739
  * Fixed `options.filename`, exposing the view path to template engines

2.4.2. / 2011-07-06 
==================

  * Revert "removed jsonp stripping" for XSS

2.4.1 / 2011-07-06 
==================

  * Added `res.json()` JSONP support. Closes #737
  * Added _extending-templates_ example. Closes #730
  * Added "strict routing" setting for trailing slashes
  * Added support for multiple envs in `app.configure()` calls. Closes #735
  * Changed: `res.send()` using `res.json()`
  * Changed: when cookie `path === null` don't default it
  * Changed; default cookie path to "home" setting. Closes #731
  * Removed _pids/logs_ creation from express(1)

2.4.0 / 2011-06-28 
==================

  * Added chainable `res.status(code)`
  * Added `res.json()`, an explicit version of `res.send(obj)`
  * Added simple web-service example

2.3.12 / 2011-06-22 
==================

  * \#express is now on freenode! come join!
  * Added `req.get(field, param)`
  * Added links to Japanese documentation, thanks @hideyukisaito!
  * Added; the `express(1)` generated app outputs the env
  * Added `content-negotiation` example
  * Dependency: connect >= 1.5.1 < 2.0.0
  * Fixed view layout bug. Closes #720
  * Fixed; ignore body on 304. Closes #701

2.3.11 / 2011-06-04 
==================

  * Added `npm test`
  * Removed generation of dummy test file from `express(1)`
  * Fixed; `express(1)` adds express as a dep
  * Fixed; prune on `prepublish`

2.3.10 / 2011-05-27 
==================

  * Added `req.route`, exposing the current route
  * Added _package.json_ generation support to `express(1)`
  * Fixed call to `app.param()` function for optional params. Closes #682

2.3.9 / 2011-05-25 
==================

  * Fixed bug-ish with `../' in `res.partial()` calls

2.3.8 / 2011-05-24
==================

  * Fixed `app.options()`

2.3.7 / 2011-05-23
==================

  * Added route `Collection`, ex: `app.get('/user/:id').remove();`
  * Added support for `app.param(fn)` to define param logic
  * Removed `app.param()` support for callback with return value
  * Removed module.parent check from express(1) generated app. Closes #670
  * Refactored router. Closes #639

2.3.6 / 2011-05-20 
==================

  * Changed; using devDependencies instead of git submodules
  * Fixed redis session example
  * Fixed markdown example
  * Fixed view caching, should not be enabled in development

2.3.5 / 2011-05-20 
==================

  * Added export `.view` as alias for `.View`

2.3.4 / 2011-05-08 
==================

  * Added `./examples/say`
  * Fixed `res.sendfile()` bug preventing the transfer of files with spaces

2.3.3 / 2011-05-03 
==================

  * Added "case sensitive routes" option.
  * Changed; split methods supported per rfc [slaskis]
  * Fixed route-specific middleware when using the same callback function several times

2.3.2 / 2011-04-27 
==================

  * Fixed view hints

2.3.1 / 2011-04-26 
==================

  * Added `app.match()` as `app.match.all()`
  * Added `app.lookup()` as `app.lookup.all()`
  * Added `app.remove()` for `app.remove.all()`
  * Added `app.remove.VERB()`
  * Fixed template caching collision issue. Closes #644
  * Moved router over from connect and started refactor

2.3.0 / 2011-04-25 
==================

  * Added options support to `res.clearCookie()`
  * Added `res.helpers()` as alias of `res.locals()`
  * Added; json defaults to UTF-8 with `res.send()`. Closes #632. [Daniel   * Dependency `connect >= 1.4.0`
  * Changed; auto set Content-Type in res.attachement [Aaron Heckmann]
  * Renamed "cache views" to "view cache". Closes #628
  * Fixed caching of views when using several apps. Closes #637
  * Fixed gotcha invoking `app.param()` callbacks once per route middleware. 
Closes #638
  * Fixed partial lookup precedence. Closes #631
Shaw]

2.2.2 / 2011-04-12 
==================

  * Added second callback support for `res.download()` connection errors
  * Fixed `filename` option passing to template engine

2.2.1 / 2011-04-04 
==================

  * Added `layout(path)` helper to change the layout within a view. Closes #610
  * Fixed `partial()` collection object support.
    Previously only anything with `.length` would work.
    When `.length` is present one must still be aware of holes,
    however now `{ collection: {foo: 'bar'}}` is valid, exposes
    `keyInCollection` and `keysInCollection`.

  * Performance improved with better view caching
  * Removed `request` and `response` locals
  * Changed; errorHandler page title is now `Express` instead of `Connect`

2.2.0 / 2011-03-30 
==================

  * Added `app.lookup.VERB()`, ex `app.lookup.put('/user/:id')`. Closes #606
  * Added `app.match.VERB()`, ex `app.match.put('/user/12')`. Closes #606
  * Added `app.VERB(path)` as alias of `app.lookup.VERB()`.
  * Dependency `connect >= 1.2.0`

2.1.1 / 2011-03-29 
==================

  * Added; expose `err.view` object when failing to locate a view
  * Fixed `res.partial()` call `next(err)` when no callback is given [reported by aheckmann]
  * Fixed; `res.send(undefined)` responds with 204 [aheckmann]

2.1.0 / 2011-03-24 
==================

  * Added `<root>/_?<name>` partial lookup support. Closes #447
  * Added `request`, `response`, and `app` local variables
  * Added `settings` local variable, containing the app's settings
  * Added `req.flash()` exception if `req.session` is not available
  * Added `res.send(bool)` support (json response)
  * Fixed stylus example for latest version
  * Fixed; wrap try/catch around `res.render()`

2.0.0 / 2011-03-17 
==================

  * Fixed up index view path alternative.
  * Changed; `res.locals()` without object returns the locals

2.0.0rc3 / 2011-03-17 
==================

  * Added `res.locals(obj)` to compliment `res.local(key, val)`
  * Added `res.partial()` callback support
  * Fixed recursive error reporting issue in `res.render()`

2.0.0rc2 / 2011-03-17 
==================

  * Changed; `partial()` "locals" are now optional
  * Fixed `SlowBuffer` support. Closes #584 [reported by tyrda01]
  * Fixed .filename view engine option [reported by drudge]
  * Fixed blog example
  * Fixed `{req,res}.app` reference when mounting [Ben Weaver]

2.0.0rc / 2011-03-14 
==================

  * Fixed; expose `HTTPSServer` constructor
  * Fixed express(1) default test charset. Closes #579 [reported by secoif]
  * Fixed; default charset to utf-8 instead of utf8 for lame IE [reported by NickP]

2.0.0beta3 / 2011-03-09 
==================

  * Added support for `res.contentType()` literal
    The original `res.contentType('.json')`,
    `res.contentType('application/json')`, and `res.contentType('json')`
    will work now.
  * Added `res.render()` status option support back
  * Added charset option for `res.render()`
  * Added `.charset` support (via connect 1.0.4)
  * Added view resolution hints when in development and a lookup fails
  * Added layout lookup support relative to the page view.
    For example while rendering `./views/user/index.jade` if you create
    `./views/user/layout.jade` it will be used in favour of the root layout.
  * Fixed `res.redirect()`. RFC states absolute url [reported by unlink]
  * Fixed; default `res.send()` string charset to utf8
  * Removed `Partial` constructor (not currently used)

2.0.0beta2 / 2011-03-07 
==================

  * Added res.render() `.locals` support back to aid in migration process
  * Fixed flash example

2.0.0beta / 2011-03-03 
==================

  * Added HTTPS support
  * Added `res.cookie()` maxAge support
  * Added `req.header()` _Referrer_ / _Referer_ special-case, either works
  * Added mount support for `res.redirect()`, now respects the mount-point
  * Added `union()` util, taking place of `merge(clone())` combo
  * Added stylus support to express(1) generated app
  * Added secret to session middleware used in examples and generated app
  * Added `res.local(name, val)` for progressive view locals
  * Added default param support to `req.param(name, default)`
  * Added `app.disabled()` and `app.enabled()`
  * Added `app.register()` support for omitting leading ".", either works
  * Added `res.partial()`, using the same interface as `partial()` within a view. Closes #539
  * Added `app.param()` to map route params to async/sync logic
  * Added; aliased `app.helpers()` as `app.locals()`. Closes #481
  * Added extname with no leading "." support to `res.contentType()`
  * Added `cache views` setting, defaulting to enabled in "production" env
  * Added index file partial resolution, eg: partial('user') may try _views/user/index.jade_.
  * Added `req.accepts()` support for extensions
  * Changed; `res.download()` and `res.sendfile()` now utilize Connect's
    static file server `connect.static.send()`.
  * Changed; replaced `connect.utils.mime()` with npm _mime_ module
  * Changed; allow `req.query` to be pre-defined (via middleware or other parent
  * Changed view partial resolution, now relative to parent view
  * Changed view engine signature. no longer `engine.render(str, options, callback)`, now `engine.compile(str, options) -> Function`, the returned function accepts `fn(locals)`.
  * Fixed `req.param()` bug returning Array.prototype methods. Closes #552
  * Fixed; using `Stream#pipe()` instead of `sys.pump()` in `res.sendfile()`
  * Fixed; using _qs_ module instead of _querystring_
  * Fixed; strip unsafe chars from jsonp callbacks
  * Removed "stream threshold" setting

1.0.8 / 2011-03-01 
==================

  * Allow `req.query` to be pre-defined (via middleware or other parent app)
  * "connect": ">= 0.5.0 < 1.0.0". Closes #547
  * Removed the long deprecated __EXPRESS_ENV__ support

1.0.7 / 2011-02-07 
==================

  * Fixed `render()` setting inheritance.
    Mounted apps would not inherit "view engine"

1.0.6 / 2011-02-07 
==================

  * Fixed `view engine` setting bug when period is in dirname

1.0.5 / 2011-02-05 
==================

  * Added secret to generated app `session()` call

1.0.4 / 2011-02-05 
==================

  * Added `qs` dependency to _package.json_
  * Fixed namespaced `require()`s for latest connect support

1.0.3 / 2011-01-13 
==================

  * Remove unsafe characters from JSONP callback names [Ryan Grove]

1.0.2 / 2011-01-10 
==================

  * Removed nested require, using `connect.router`

1.0.1 / 2010-12-29 
==================

  * Fixed for middleware stacked via `createServer()`
    previously the `foo` middleware passed to `createServer(foo)`
    would not have access to Express methods such as `res.send()`
    or props like `req.query` etc.

1.0.0 / 2010-11-16 
==================

  * Added; deduce partial object names from the last segment.
    For example by default `partial('forum/post', postObject)` will
    give you the _post_ object, providing a meaningful default.
  * Added http status code string representation to `res.redirect()` body
  * Added; `res.redirect()` supporting _text/plain_ and _text/html_ via __Accept__.
  * Added `req.is()` to aid in content negotiation
  * Added partial local inheritance [suggested by masylum]. Closes #102
    providing access to parent template locals.
  * Added _-s, --session[s]_ flag to express(1) to add session related middleware
  * Added _--template_ flag to express(1) to specify the
    template engine to use.
  * Added _--css_ flag to express(1) to specify the 
    stylesheet engine to use (or just plain css by default).
  * Added `app.all()` support [thanks aheckmann]
  * Added partial direct object support.
    You may now `partial('user', user)` providing the "user" local,
    vs previously `partial('user', { object: user })`.
  * Added _route-separation_ example since many people question ways
    to do this with CommonJS modules. Also view the _blog_ example for
    an alternative.
  * Performance; caching view path derived partial object names
  * Fixed partial local inheritance precedence. [reported by Nick Poulden] Closes #454
  * Fixed jsonp support; _text/javascript_ as per mailinglist discussion

1.0.0rc4 / 2010-10-14 
==================

  * Added _NODE_ENV_ support, _EXPRESS_ENV_ is deprecated and will be removed in 1.0.0
  * Added route-middleware support (very helpful, see the [docs](http://expressjs.com/guide.html#Route-Middleware))
  * Added _jsonp callback_ setting to enable/disable jsonp autowrapping [Dav Glass]
  * Added callback query check on response.send to autowrap JSON objects for simple webservice implementations [Dav Glass]
  * Added `partial()` support for array-like collections. Closes #434
  * Added support for swappable querystring parsers
  * Added session usage docs. Closes #443
  * Added dynamic helper caching. Closes #439 [suggested by maritz]
  * Added authentication example
  * Added basic Range support to `res.sendfile()` (and `res.download()` etc)
  * Changed; `express(1)` generated app using 2 spaces instead of 4
  * Default env to "development" again [aheckmann]
  * Removed _context_ option is no more, use "scope"
  * Fixed; exposing _./support_ libs to examples so they can run without installs
  * Fixed mvc example

1.0.0rc3 / 2010-09-20 
==================

  * Added confirmation for `express(1)` app generation. Closes #391
  * Added extending of flash formatters via `app.flashFormatters`
  * Added flash formatter support. Closes #411
  * Added streaming support to `res.sendfile()` using `sys.pump()` when >= "stream threshold"
  * Added _stream threshold_ setting for `res.sendfile()`
  * Added `res.send()` __HEAD__ support
  * Added `res.clearCookie()`
  * Added `res.cookie()`
  * Added `res.render()` headers option
  * Added `res.redirect()` response bodies
  * Added `res.render()` status option support. Closes #425 [thanks aheckmann]
  * Fixed `res.sendfile()` responding with 403 on malicious path
  * Fixed `res.download()` bug; when an error occurs remove _Content-Disposition_
  * Fixed; mounted apps settings now inherit from parent app [aheckmann]
  * Fixed; stripping Content-Length / Content-Type when 204
  * Fixed `res.send()` 204. Closes #419
  * Fixed multiple _Set-Cookie_ headers via `res.header()`. Closes #402
  * Fixed bug messing with error handlers when `listenFD()` is called instead of `listen()`. [thanks guillermo]


1.0.0rc2 / 2010-08-17 
==================

  * Added `app.register()` for template engine mapping. Closes #390
  * Added `res.render()` callback support as second argument (no options)
  * Added callback support to `res.download()`
  * Added callback support for `res.sendfile()`
  * Added support for middleware access via `express.middlewareName()` vs `connect.middlewareName()`
  * Added "partials" setting to docs
  * Added default expresso tests to `express(1)` generated app. Closes #384
  * Fixed `res.sendfile()` error handling, defer via `next()`
  * Fixed `res.render()` callback when a layout is used [thanks guillermo]
  * Fixed; `make install` creating ~/.node_libraries when not present
  * Fixed issue preventing error handlers from being defined anywhere. Closes #387 

1.0.0rc / 2010-07-28
==================

  * Added mounted hook. Closes #369
  * Added connect dependency to _package.json_

  * Removed "reload views" setting and support code
    development env never caches, production always caches.

  * Removed _param_ in route callbacks, signature is now
    simply (req, res, next), previously (req, res, params, next).
    Use _req.params_ for path captures, _req.query_ for GET params.

  * Fixed "home" setting
  * Fixed middleware/router precedence issue. Closes #366
  * Fixed; _configure()_ callbacks called immediately. Closes #368
	
1.0.0beta2 / 2010-07-23
==================

  * Added more examples
  * Added; exporting `Server` constructor
  * Added `Server#helpers()` for view locals
  * Added `Server#dynamicHelpers()` for dynamic view locals. Closes #349
  * Added support for absolute view paths
  * Added; _home_ setting defaults to `Server#route` for mounted apps. Closes #363
  * Added Guillermo Rauch to the contributor list
  * Added support for "as" for non-collection partials. Closes #341
  * Fixed _install.sh_, ensuring _~/.node_libraries_ exists. Closes #362 [thanks jf]
  * Fixed `res.render()` exceptions, now passed to `next()` when no callback is given [thanks guillermo]
  * Fixed instanceof `Array` checks, now `Array.isArray()`
  * Fixed express(1) expansion of public dirs. Closes #348
  * Fixed middleware precedence. Closes #345
  * Fixed view watcher, now async [thanks aheckmann]

1.0.0beta / 2010-07-15
==================

  * Re-write
    - much faster
    - much lighter
    - Check [ExpressJS.com](http://expressjs.com) for migration guide and updated docs

0.14.0 / 2010-06-15
==================

  * Utilize relative requires
  * Added Static bufferSize option [aheckmann]
  * Fixed caching of view and partial subdirectories [aheckmann]
  * Fixed mime.type() comments now that ".ext" is not supported
  * Updated haml submodule
  * Updated class submodule
  * Removed bin/express

0.13.0 / 2010-06-01
==================

  * Added node v0.1.97 compatibility
  * Added support for deleting cookies via Request#cookie('key', null)
  * Updated haml submodule
  * Fixed not-found page, now using using charset utf-8
  * Fixed show-exceptions page, now using using charset utf-8
  * Fixed view support due to fs.readFile Buffers
  * Changed; mime.type() no longer accepts ".type" due to node extname() changes

0.12.0 / 2010-05-22
==================

  * Added node v0.1.96 compatibility
  * Added view `helpers` export which act as additional local variables
  * Updated haml submodule
  * Changed ETag; removed inode, modified time only
  * Fixed LF to CRLF for setting multiple cookies
  * Fixed cookie complation; values are now urlencoded
  * Fixed cookies parsing; accepts quoted values and url escaped cookies

0.11.0 / 2010-05-06
==================

  * Added support for layouts using different engines
    - this.render('page.html.haml', { layout: 'super-cool-layout.html.ejs' })
    - this.render('page.html.haml', { layout: 'foo' }) // assumes 'foo.html.haml'
    - this.render('page.html.haml', { layout: false }) // no layout
  * Updated ext submodule
  * Updated haml submodule
  * Fixed EJS partial support by passing along the context. Issue #307

0.10.1 / 2010-05-03
==================

  * Fixed binary uploads.

0.10.0 / 2010-04-30
==================

  * Added charset support via Request#charset (automatically assigned to 'UTF-8' when respond()'s
    encoding is set to 'utf8' or 'utf-8'.
  * Added "encoding" option to Request#render(). Closes #299
  * Added "dump exceptions" setting, which is enabled by default.
  * Added simple ejs template engine support
  * Added error reponse support for text/plain, application/json. Closes #297
  * Added callback function param to Request#error()
  * Added Request#sendHead()
  * Added Request#stream()
  * Added support for Request#respond(304, null) for empty response bodies
  * Added ETag support to Request#sendfile()
  * Added options to Request#sendfile(), passed to fs.createReadStream()
  * Added filename arg to Request#download()
  * Performance enhanced due to pre-reversing plugins so that plugins.reverse() is not called on each request
  * Performance enhanced by preventing several calls to toLowerCase() in Router#match()
  * Changed; Request#sendfile() now streams
  * Changed; Renamed Request#halt() to Request#respond(). Closes #289
  * Changed; Using sys.inspect() instead of JSON.encode() for error output
  * Changed; run() returns the http.Server instance. Closes #298
  * Changed; Defaulting Server#host to null (INADDR_ANY)
  * Changed; Logger "common" format scale of 0.4f
  * Removed Logger "request" format
  * Fixed; Catching ENOENT in view caching, preventing error when "views/partials" is not found
  * Fixed several issues with http client
  * Fixed Logger Content-Length output
  * Fixed bug preventing Opera from retaining the generated session id. Closes #292

0.9.0 / 2010-04-14
==================

  * Added DSL level error() route support
  * Added DSL level notFound() route support
  * Added Request#error()
  * Added Request#notFound()
  * Added Request#render() callback function. Closes #258
  * Added "max upload size" setting
  * Added "magic" variables to collection partials (\_\_index\_\_, \_\_length\_\_, \_\_isFirst\_\_, \_\_isLast\_\_). Closes #254
  * Added [haml.js](http://github.com/visionmedia/haml.js) submodule; removed haml-js
  * Added callback function support to Request#halt() as 3rd/4th arg
  * Added preprocessing of route param wildcards using param(). Closes #251
  * Added view partial support (with collections etc)
  * Fixed bug preventing falsey params (such as ?page=0). Closes #286
  * Fixed setting of multiple cookies. Closes #199
  * Changed; view naming convention is now NAME.TYPE.ENGINE (for example page.html.haml)
  * Changed; session cookie is now httpOnly
  * Changed; Request is no longer global
  * Changed; Event is no longer global
  * Changed; "sys" module is no longer global
  * Changed; moved Request#download to Static plugin where it belongs
  * Changed; Request instance created before body parsing. Closes #262
  * Changed; Pre-caching views in memory when "cache view contents" is enabled. Closes #253
  * Changed; Pre-caching view partials in memory when "cache view partials" is enabled
  * Updated support to node --version 0.1.90
  * Updated dependencies
  * Removed set("session cookie") in favour of use(Session, { cookie: { ... }})
  * Removed utils.mixin(); use Object#mergeDeep()
  
0.8.0 / 2010-03-19
==================

  * Added coffeescript example app. Closes #242
  * Changed; cache api now async friendly. Closes #240
  * Removed deprecated 'express/static' support. Use 'express/plugins/static'

0.7.6 / 2010-03-19
==================

  * Added Request#isXHR. Closes #229
  * Added `make install` (for the executable)
  * Added `express` executable for setting up simple app templates
  * Added "GET /public/*" to Static plugin, defaulting to <root>/public
  * Added Static plugin
  * Fixed; Request#render() only calls cache.get() once
  * Fixed; Namespacing View caches with "view:"
  * Fixed; Namespacing Static caches with "static:"
  * Fixed; Both example apps now use the Static plugin
  * Fixed set("views"). Closes #239
  * Fixed missing space for combined log format
  * Deprecated Request#sendfile() and 'express/static'
  * Removed Server#running

0.7.5 / 2010-03-16
==================

  * Added Request#flash() support without args, now returns all flashes
  * Updated ext submodule

0.7.4 / 2010-03-16
==================

  * Fixed session reaper
  * Changed; class.js replacing js-oo Class implementation (quite a bit faster, no browser cruft)

0.7.3 / 2010-03-16
==================

  * Added package.json
  * Fixed requiring of haml / sass due to kiwi removal

0.7.2 / 2010-03-16
==================

  * Fixed GIT submodules (HAH!)

0.7.1 / 2010-03-16
==================

  * Changed; Express now using submodules again until a PM is adopted
  * Changed; chat example using millisecond conversions from ext

0.7.0 / 2010-03-15
==================

  * Added Request#pass() support (finds the next matching route, or the given path)
  * Added Logger plugin (default "common" format replaces CommonLogger)
  * Removed Profiler plugin
  * Removed CommonLogger plugin

0.6.0 / 2010-03-11
==================

  * Added seed.yml for kiwi package management support
  * Added HTTP client query string support when method is GET. Closes #205
  
  * Added support for arbitrary view engines.
    For example "foo.engine.html" will now require('engine'),
    the exports from this module are cached after the first require().
    
  * Added async plugin support
  
  * Removed usage of RESTful route funcs as http client
    get() etc, use http.get() and friends
  
  * Removed custom exceptions

0.5.0 / 2010-03-10
==================

  * Added ext dependency (library of js extensions)
  * Removed extname() / basename() utils. Use path module
  * Removed toArray() util. Use arguments.values
  * Removed escapeRegexp() util. Use RegExp.escape()
  * Removed process.mixin() dependency. Use utils.mixin()
  * Removed Collection
  * Removed ElementCollection
  * Shameless self promotion of ebook "Advanced JavaScript" (http://dev-mag.com)  ;)

0.4.0 / 2010-02-11
==================

  * Added flash() example to sample upload app
  * Added high level restful http client module (express/http)
  * Changed; RESTful route functions double as HTTP clients. Closes #69
  * Changed; throwing error when routes are added at runtime
  * Changed; defaulting render() context to the current Request. Closes #197
  * Updated haml submodule

0.3.0 / 2010-02-11
==================

  * Updated haml / sass submodules. Closes #200
  * Added flash message support. Closes #64
  * Added accepts() now allows multiple args. fixes #117
  * Added support for plugins to halt. Closes #189
  * Added alternate layout support. Closes #119
  * Removed Route#run(). Closes #188
  * Fixed broken specs due to use(Cookie) missing

0.2.1 / 2010-02-05
==================

  * Added "plot" format option for Profiler (for gnuplot processing)
  * Added request number to Profiler plugin
  * Fixed binary encoding for multi-part file uploads, was previously defaulting to UTF8
  * Fixed issue with routes not firing when not files are present. Closes #184
  * Fixed process.Promise -> events.Promise

0.2.0 / 2010-02-03
==================

  * Added parseParam() support for name[] etc. (allows for file inputs with "multiple" attr) Closes #180
  * Added Both Cache and Session option "reapInterval" may be "reapEvery". Closes #174
  * Added expiration support to cache api with reaper. Closes #133
  * Added cache Store.Memory#reap()
  * Added Cache; cache api now uses first class Cache instances
  * Added abstract session Store. Closes #172
  * Changed; cache Memory.Store#get() utilizing Collection
  * Renamed MemoryStore -> Store.Memory
  * Fixed use() of the same plugin several time will always use latest options. Closes #176

0.1.0 / 2010-02-03
==================

  * Changed; Hooks (before / after) pass request as arg as well as evaluated in their context
  * Updated node support to 0.1.27 Closes #169
  * Updated dirname(__filename) -> __dirname
  * Updated libxmljs support to v0.2.0
  * Added session support with memory store / reaping
  * Added quick uid() helper
  * Added multi-part upload support
  * Added Sass.js support / submodule
  * Added production env caching view contents and static files
  * Added static file caching. Closes #136
  * Added cache plugin with memory stores
  * Added support to StaticFile so that it works with non-textual files.
  * Removed dirname() helper
  * Removed several globals (now their modules must be required)

0.0.2 / 2010-01-10
==================

  * Added view benchmarks; currently haml vs ejs
  * Added Request#attachment() specs. Closes #116
  * Added use of node's parseQuery() util. Closes #123
  * Added `make init` for submodules
  * Updated Haml
  * Updated sample chat app to show messages on load
  * Updated libxmljs parseString -> parseHtmlString
  * Fixed `make init` to work with older versions of git
  * Fixed specs can now run independant specs for those who cant build deps. Closes #127
  * Fixed issues introduced by the node url module changes. Closes 126.
  * Fixed two assertions failing due to Collection#keys() returning strings
  * Fixed faulty Collection#toArray() spec due to keys() returning strings
  * Fixed `make test` now builds libxmljs.node before testing

0.0.1 / 2010-01-03
==================

  * Initial release
