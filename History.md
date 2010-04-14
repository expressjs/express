
0.9.0 / 2010-04-14
==================

  * Added [haml.js](http://github.com/visionmedia/haml.js) submodule; removed haml-js
  * Fixed bug preventing falsey params (such as ?page=0). Closes #286
  * Fixed setting of multiple cookies. Closes #199
  * Changed; view naming convention is now NAME.TYPE.ENGINE (for example page.html.haml)
  * Changed; session cookie is now httpOnly
  * Changed; Request is no longer global
  * Changed; Event is no longer global
  * Changed; "sys" module is no longer global
  * Changed; moved Request#download to Static plugin where it belongs
  * Updated support to node --version 0.1.90
  * Updated dependencies
  
  * Added "magic" variables to collection partials (__index__, __length__, __isFirst__, __isLast__). Closes #254
  * Request instance created before body parsing. Closes #262
  * Fixed post param issue
  * Fixed mocks to work with new routing api
  * .
  * Docs
  * Merge branch 'upload-limit'
  * Added "max upload size" setting
  * Updated ext. Closes #256
  * Added Request#render() callback function. Closes #258
  * Merge branch 'integration'
  * fn -> callback
  * Typo
  * Merge branch 'master' of git://github.com/aheckmann/express into integration
  * Updated to JSpec 4.0.0
  * error() is passed the exception
  * fn -> callback
  * Added DSL level error() route support
  * Added DSL level notFound() route support
  * Added specs for Request#notFound()
  * More Request#error() specs
  * Added specs for Request#error()
  * Merge branch 'errors'
  * Added publish Request#notFound()
  * Removed Express.error(), Added public Request#error()
  * Request#halt() accepts callback function as 3rd/4th arg
  * Merge branch 'error-handling'
  * Misc error handling improvements
  * Removed unused variable
  * Merge branch 'error-handling'
  * Caching notFound / showException modules
  * Express.error() now acts as the core exception handler
  * request response event is now fired in reverse.
  * Handle when a plugin response fails
  * next -> callback
  * Styling
  * Removed set("session cookie") in favour of use(Session, { cookie: { ... }})
  * Docs for stable / edge
  * Merge branch 'route-wildcards'
  * Added preprocessing of route param wildcards using param(). Closes #251
  * Added specs for param()
  * Added more route wildcard specs
  * Merge branch 'pre-cache-views'
  * Pre-caching views in memory. Closes #253
  * Started pre caching of views
  * Merge branch 'integration'
  * Added assertion to ensure that partials dir is relative to set("views")
  * Re-using variables
  * Using set("views") when setting set("partials")
  * partialscache -> partials
  * preload partials add settings bug fix, partial now works when cache view contents is true
  * add cache view partials
  * Removed utils.mixin() use Object#mergeDeep()
  * Merge branch 'partials'
  * Chat sample app using partials as an example
  * Added partial "as" option
  * Partial collection should not introduce newlines
  * Added partial collection support
  * Started view partial support
  * Updated ext submodule
  * Removed Request#_blendInNodeRequest()
  * Merge branch 'net2_fixes' of git://github.com/ciaranj/express
  * Updated support to v0.1.33
  * Various minor fixes required to make express work post the net2 merge branch

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
