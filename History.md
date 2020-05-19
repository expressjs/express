5.0.0-alpha.8 / 2020-03-25
==========================

This is the eighth Express 5.0 alpha release, based off 4.17.1 and includes
changes from 5.0.0-alpha.7.

5.0.0-alpha.7 / 2018-10-26
==========================

This is the seventh Express 5.0 alpha release, based off 4.16.4 and includes
changes from 5.0.0-alpha.6.

The major change with this alpha is the basic support for returned, rejected
Promises in the router.

  * remove:
    - `path-to-regexp` dependency
  * deps: debug@3.1.0
    - Add `DEBUG_HIDE_DATE` environment variable
    - Change timer to per-namespace instead of global
    - Change non-TTY date format
    - Remove `DEBUG_FD` environment variable support
    - Support 256 namespace colors
  * deps: router@2.0.0-alpha.1
    - Add basic support for returned, rejected Promises
    - Fix JSDoc for `Router` constructor
    - deps: debug@3.1.0
    - deps: parseurl@~1.3.2
    - deps: setprototypeof@1.1.0
    - deps: utils-merge@1.0.1

5.0.0-alpha.6 / 2017-09-24
==========================

This is the sixth Express 5.0 alpha release, based off 4.15.5 and includes
changes from 5.0.0-alpha.5.

  * remove:
    - `res.redirect(url, status)` signature - use `res.redirect(status, url)`
    - `res.send(status, body)` signature - use `res.status(status).send(body)`
  * deps: router@~1.3.1
    - deps: debug@2.6.8

5.0.0-alpha.5 / 2017-03-06
==========================

This is the fifth Express 5.0 alpha release, based off 4.15.2 and includes
changes from 5.0.0-alpha.4.

5.0.0-alpha.4 / 2017-03-01
==========================

This is the fourth Express 5.0 alpha release, based off 4.15.0 and includes
changes from 5.0.0-alpha.3.

  * remove:
    - Remove Express 3.x middleware error stubs
  * deps: router@~1.3.0
    - Add `next("router")` to exit from router
    - Fix case where `router.use` skipped requests routes did not
    - Skip routing when `req.url` is not set
    - Use `%o` in path debug to tell types apart
    - deps: debug@2.6.1
    - deps: setprototypeof@1.0.3
    - perf: add fast match path for `*` route

5.0.0-alpha.3 / 2017-01-28
==========================

This is the third Express 5.0 alpha release, based off 4.14.1 and includes
changes from 5.0.0-alpha.2.

  * remove:
    - `res.json(status, obj)` signature - use `res.status(status).json(obj)`
    - `res.jsonp(status, obj)` signature - use `res.status(status).jsonp(obj)`
    - `res.vary()` (no arguments) -- provide a field name as an argument
  * deps: array-flatten@2.1.1
  * deps: path-is-absolute@1.0.1
  * deps: router@~1.1.5
    - deps: array-flatten@2.0.1
    - deps: methods@~1.1.2
    - deps: parseurl@~1.3.1
    - deps: setprototypeof@1.0.2

5.0.0-alpha.2 / 2015-07-06
==========================

This is the second Express 5.0 alpha release, based off 4.13.1 and includes
changes from 5.0.0-alpha.1.

  * remove:
    - `app.param(fn)`
    - `req.param()` -- use `req.params`, `req.body`, or `req.query` instead
  * change:
    - `res.render` callback is always async, even for sync view engines
    - The leading `:` character in `name` for `app.param(name, fn)` is no longer removed
    - Use `router` module for routing
    - Use `path-is-absolute` module for absolute path detection

5.0.0-alpha.1 / 2014-11-06
==========================

This is the first Express 5.0 alpha release, based off 4.10.1.

  * remove:
    - `app.del` - use `app.delete`
    - `req.acceptsCharset` - use `req.acceptsCharsets`
    - `req.acceptsEncoding` - use `req.acceptsEncodings`
    - `req.acceptsLanguage` - use `req.acceptsLanguages`
    - `res.json(obj, status)` signature - use `res.json(status, obj)`
    - `res.jsonp(obj, status)` signature - use `res.jsonp(status, obj)`
    - `res.send(body, status)` signature - use `res.send(status, body)`
    - `res.send(status)` signature - use `res.sendStatus(status)`
    - `res.sendfile` - use `res.sendFile` instead
    - `express.query` middleware
  * change:
    - `req.host` now returns host (`hostname:port`) - use `req.hostname` for only hostname
    - `req.query` is now a getter instead of a plain property
  * add:
    - `app.router` is a reference to the base router

4.17.1 / 2019-05-25
===================

  * Revert "Improve error message for `null`/`undefined` to `res.status`"

4.17.0 / 2019-05-16
===================

  * Add `express.raw` to parse bodies into `Buffer`
  * Add `express.text` to parse bodies into string
  * Improve error message for non-strings to `res.sendFile`
  * Improve error message for `null`/`undefined` to `res.status`
  * Support multiple hosts in `X-Forwarded-Host`
  * deps: accepts@~1.3.7
  * deps: body-parser@1.19.0
    - Add encoding MIK
    - Add petabyte (`pb`) support
    - Fix parsing array brackets after index
    - deps: bytes@3.1.0
    - deps: http-errors@1.7.2
    - deps: iconv-lite@0.4.24
    - deps: qs@6.7.0
    - deps: raw-body@2.4.0
    - deps: type-is@~1.6.17
  * deps: content-disposition@0.5.3
  * deps: cookie@0.4.0
    - Add `SameSite=None` support
  * deps: finalhandler@~1.1.2
    - Set stricter `Content-Security-Policy` header
    - deps: parseurl@~1.3.3
    - deps: statuses@~1.5.0
  * deps: parseurl@~1.3.3
  * deps: proxy-addr@~2.0.5
    - deps: ipaddr.js@1.9.0
  * deps: qs@6.7.0
    - Fix parsing array brackets after index
  * deps: range-parser@~1.2.1
  * deps: send@0.17.1
    - Set stricter CSP header in redirect & error responses
    - deps: http-errors@~1.7.2
    - deps: mime@1.6.0
    - deps: ms@2.1.1
    - deps: range-parser@~1.2.1
    - deps: statuses@~1.5.0
    - perf: remove redundant `path.normalize` call
  * deps: serve-static@1.14.1
    - Set stricter CSP header in redirect response
    - deps: parseurl@~1.3.3
    - deps: send@0.17.1
  * deps: setprototypeof@1.1.1
  * deps: statuses@~1.5.0
    - Add `103 Early Hints`
  * deps: type-is@~1.6.18
    - deps: mime-types@~2.1.24
    - perf: prevent internal `throw` on invalid type

4.16.4 / 2018-10-10
===================

  * Fix issue where `"Request aborted"` may be logged in `res.sendfile`
  * Fix JSDoc for `Router` constructor
  * deps: body-parser@1.18.3
    - Fix deprecation warnings on Node.js 10+
    - Fix stack trace for strict json parse error
    - deps: depd@~1.1.2
    - deps: http-errors@~1.6.3
    - deps: iconv-lite@0.4.23
    - deps: qs@6.5.2
    - deps: raw-body@2.3.3
    - deps: type-is@~1.6.16
  * deps: proxy-addr@~2.0.4
    - deps: ipaddr.js@1.8.0
  * deps: qs@6.5.2
  * deps: safe-buffer@5.1.2

4.16.3 / 2018-03-12
===================

  * deps: accepts@~1.3.5
    - deps: mime-types@~2.1.18
  * deps: depd@~1.1.2
    - perf: remove argument reassignment
  * deps: encodeurl@~1.0.2
    - Fix encoding `%` as last character
  * deps: finalhandler@1.1.1
    - Fix 404 output for bad / missing pathnames
    - deps: encodeurl@~1.0.2
    - deps: statuses@~1.4.0
  * deps: proxy-addr@~2.0.3
    - deps: ipaddr.js@1.6.0
  * deps: send@0.16.2
    - Fix incorrect end tag in default error & redirects
    - deps: depd@~1.1.2
    - deps: encodeurl@~1.0.2
    - deps: statuses@~1.4.0
  * deps: serve-static@1.13.2
    - Fix incorrect end tag in redirects
    - deps: encodeurl@~1.0.2
    - deps: send@0.16.2
  * deps: statuses@~1.4.0
  * deps: type-is@~1.6.16
    - deps: mime-types@~2.1.18

4.16.2 / 2017-10-09
===================

  * Fix `TypeError` in `res.send` when given `Buffer` and `ETag` header set
  * perf: skip parsing of entire `X-Forwarded-Proto` header

4.16.1 / 2017-09-29
===================

  * deps: send@0.16.1
  * deps: serve-static@1.13.1
    - Fix regression when `root` is incorrectly set to a file
    - deps: send@0.16.1

4.16.0 / 2017-09-28
===================

  * Add `"json escape"` setting for `res.json` and `res.jsonp`
  * Add `express.json` and `express.urlencoded` to parse bodies
  * Add `options` argument to `res.download`
  * Improve error message when autoloading invalid view engine
  * Improve error messages when non-function provided as middleware
  * Skip `Buffer` encoding when not generating ETag for small response
  * Use `safe-buffer` for improved Buffer API
  * deps: accepts@~1.3.4
    - deps: mime-types@~2.1.16
  * deps: content-type@~1.0.4
    - perf: remove argument reassignment
    - perf: skip parameter parsing when no parameters
  * deps: etag@~1.8.1
    - perf: replace regular expression with substring
  * deps: finalhandler@1.1.0
    - Use `res.headersSent` when available
  * deps: parseurl@~1.3.2
    - perf: reduce overhead for full URLs
    - perf: unroll the "fast-path" `RegExp`
  * deps: proxy-addr@~2.0.2
    - Fix trimming leading / trailing OWS in `X-Forwarded-For`
    - deps: forwarded@~0.1.2
    - deps: ipaddr.js@1.5.2
    - perf: reduce overhead when no `X-Forwarded-For` header
  * deps: qs@6.5.1
    - Fix parsing & compacting very deep objects
  * deps: send@0.16.0
    - Add 70 new types for file extensions
    - Add `immutable` option
    - Fix missing `</html>` in default error & redirects
    - Set charset as "UTF-8" for .js and .json
    - Use instance methods on steam to check for listeners
    - deps: mime@1.4.1
    - perf: improve path validation speed
  * deps: serve-static@1.13.0
    - Add 70 new types for file extensions
    - Add `immutable` option
    - Set charset as "UTF-8" for .js and .json
    - deps: send@0.16.0
  * deps: setprototypeof@1.1.0
  * deps: utils-merge@1.0.1
  * deps: vary@~1.1.2
    - perf: improve header token parsing speed
  * perf: re-use options object when generating ETags
  * perf: remove dead `.charset` set in `res.jsonp`

4.15.5 / 2017-09-24
===================

  * deps: debug@2.6.9
  * deps: finalhandler@~1.0.6
    - deps: debug@2.6.9
    - deps: parseurl@~1.3.2
  * deps: fresh@0.5.2
    - Fix handling of modified headers with invalid dates
    - perf: improve ETag match loop
    - perf: improve `If-None-Match` token parsing
  * deps: send@0.15.6
    - Fix handling of modified headers with invalid dates
    - deps: debug@2.6.9
    - deps: etag@~1.8.1
    - deps: fresh@0.5.2
    - perf: improve `If-Match` token parsing
  * deps: serve-static@1.12.6
    - deps: parseurl@~1.3.2
    - deps: send@0.15.6
    - perf: improve slash collapsing

4.15.4 / 2017-08-06
===================

  * deps: debug@2.6.8
  * deps: depd@~1.1.1
    - Remove unnecessary `Buffer` loading
  * deps: finalhandler@~1.0.4
    - deps: debug@2.6.8
  * deps: proxy-addr@~1.1.5
    - Fix array argument being altered
    - deps: ipaddr.js@1.4.0
  * deps: qs@6.5.0
  * deps: send@0.15.4
    - deps: debug@2.6.8
    - deps: depd@~1.1.1
    - deps: http-errors@~1.6.2
  * deps: serve-static@1.12.4
    - deps: send@0.15.4

4.15.3 / 2017-05-16
===================

  * Fix error when `res.set` cannot add charset to `Content-Type`
  * deps: debug@2.6.7
    - Fix `DEBUG_MAX_ARRAY_LENGTH`
    - deps: ms@2.0.0
  * deps: finalhandler@~1.0.3
    - Fix missing `</html>` in HTML document
    - deps: debug@2.6.7
  * deps: proxy-addr@~1.1.4
    - deps: ipaddr.js@1.3.0
  * deps: send@0.15.3
    - deps: debug@2.6.7
    - deps: ms@2.0.0
  * deps: serve-static@1.12.3
    - deps: send@0.15.3
  * deps: type-is@~1.6.15
    - deps: mime-types@~2.1.15
  * deps: vary@~1.1.1
    - perf: hoist regular expression

4.15.2 / 2017-03-06
===================

  * deps: qs@6.4.0
    - Fix regression parsing keys starting with `[`

4.15.1 / 2017-03-05
===================

  * deps: send@0.15.1
    - Fix issue when `Date.parse` does not return `NaN` on invalid date
    - Fix strict violation in broken environments
  * deps: serve-static@1.12.1
    - Fix issue when `Date.parse` does not return `NaN` on invalid date
    - deps: send@0.15.1

4.15.0 / 2017-03-01
===================

  * Add debug message when loading view engine
  * Add `next("router")` to exit from router
  * Fix case where `router.use` skipped requests routes did not
  * Remove usage of `res._headers` private field
    - Improves compatibility with Node.js 8 nightly
  * Skip routing when `req.url` is not set
  * Use `%o` in path debug to tell types apart
  * Use `Object.create` to setup request & response prototypes
  * Use `setprototypeof` module to replace `__proto__` setting
  * Use `statuses` instead of `http` module for status messages
  * deps: debug@2.6.1
    - Allow colors in workers
    - Deprecated `DEBUG_FD` environment variable set to `3` or higher
    - Fix error when running under React Native
    - Use same color for same namespace
    - deps: ms@0.7.2
  * deps: etag@~1.8.0
    - Use SHA1 instead of MD5 for ETag hashing
    - Works with FIPS 140-2 OpenSSL configuration
  * deps: finalhandler@~1.0.0
    - Fix exception when `err` cannot be converted to a string
    - Fully URL-encode the pathname in the 404
    - Only include the pathname in the 404 message
    - Send complete HTML document
    - Set `Content-Security-Policy: default-src 'self'` header
    - deps: debug@2.6.1
  * deps: fresh@0.5.0
    - Fix false detection of `no-cache` request directive
    - Fix incorrect result when `If-None-Match` has both `*` and ETags
    - Fix weak `ETag` matching to match spec
    - perf: delay reading header values until needed
    - perf: enable strict mode
    - perf: hoist regular expressions
    - perf: remove duplicate conditional
    - perf: remove unnecessary boolean coercions
    - perf: skip checking modified time if ETag check failed
    - perf: skip parsing `If-None-Match` when no `ETag` header
    - perf: use `Date.parse` instead of `new Date`
  * deps: qs@6.3.1
    - Fix array parsing from skipping empty values
    - Fix compacting nested arrays
  * deps: send@0.15.0
    - Fix false detection of `no-cache` request directive
    - Fix incorrect result when `If-None-Match` has both `*` and ETags
    - Fix weak `ETag` matching to match spec
    - Remove usage of `res._headers` private field
    - Support `If-Match` and `If-Unmodified-Since` headers
    - Use `res.getHeaderNames()` when available
    - Use `res.headersSent` when available
    - deps: debug@2.6.1
    - deps: etag@~1.8.0
    - deps: fresh@0.5.0
    - deps: http-errors@~1.6.1
  * deps: serve-static@1.12.0
    - Fix false detection of `no-cache` request directive
    - Fix incorrect result when `If-None-Match` has both `*` and ETags
    - Fix weak `ETag` matching to match spec
    - Remove usage of `res._headers` private field
    - Send complete HTML document in redirect response
    - Set default CSP header in redirect response
    - Support `If-Match` and `If-Unmodified-Since` headers
    - Use `res.getHeaderNames()` when available
    - Use `res.headersSent` when available
    - deps: send@0.15.0
  * perf: add fast match path for `*` route
  * perf: improve `req.ips` performance

4.14.1 / 2017-01-28
===================

  * deps: content-disposition@0.5.2
  * deps: finalhandler@0.5.1
    - Fix exception when `err.headers` is not an object
    - deps: statuses@~1.3.1
    - perf: hoist regular expressions
    - perf: remove duplicate validation path
  * deps: proxy-addr@~1.1.3
    - deps: ipaddr.js@1.2.0
  * deps: send@0.14.2
    - deps: http-errors@~1.5.1
    - deps: ms@0.7.2
    - deps: statuses@~1.3.1
  * deps: serve-static@~1.11.2
    - deps: send@0.14.2
  * deps: type-is@~1.6.14
    - deps: mime-types@~2.1.13

4.14.0 / 2016-06-16
===================

  * Add `acceptRanges` option to `res.sendFile`/`res.sendfile`
  * Add `cacheControl` option to `res.sendFile`/`res.sendfile`
  * Add `options` argument to `req.range`
    - Includes the `combine` option
  * Encode URL in `res.location`/`res.redirect` if not already encoded
  * Fix some redirect handling in `res.sendFile`/`res.sendfile`
  * Fix Windows absolute path check using forward slashes
  * Improve error with invalid arguments to `req.get()`
  * Improve performance for `res.json`/`res.jsonp` in most cases
  * Improve `Range` header handling in `res.sendFile`/`res.sendfile`
  * deps: accepts@~1.3.3
    - Fix including type extensions in parameters in `Accept` parsing
    - Fix parsing `Accept` parameters with quoted equals
    - Fix parsing `Accept` parameters with quoted semicolons
    - Many performance improvements
    - deps: mime-types@~2.1.11
    - deps: negotiator@0.6.1
  * deps: content-type@~1.0.2
    - perf: enable strict mode
  * deps: cookie@0.3.1
    - Add `sameSite` option
    - Fix cookie `Max-Age` to never be a floating point number
    - Improve error message when `encode` is not a function
    - Improve error message when `expires` is not a `Date`
    - Throw better error for invalid argument to parse
    - Throw on invalid values provided to `serialize`
    - perf: enable strict mode
    - perf: hoist regular expression
    - perf: use for loop in parse
    - perf: use string concatenation for serialization
  * deps: finalhandler@0.5.0
    - Change invalid or non-numeric status code to 500
    - Overwrite status message to match set status code
    - Prefer `err.statusCode` if `err.status` is invalid
    - Set response headers from `err.headers` object
    - Use `statuses` instead of `http` module for status messages
  * deps: proxy-addr@~1.1.2
    - Fix accepting various invalid netmasks
    - Fix IPv6-mapped IPv4 validation edge cases
    - IPv4 netmasks must be contiguous
    - IPv6 addresses cannot be used as a netmask
    - deps: ipaddr.js@1.1.1
  * deps: qs@6.2.0
    - Add `decoder` option in `parse` function
  * deps: range-parser@~1.2.0
    - Add `combine` option to combine overlapping ranges
    - Fix incorrectly returning -1 when there is at least one valid range
    - perf: remove internal function
  * deps: send@0.14.1
    - Add `acceptRanges` option
    - Add `cacheControl` option
    - Attempt to combine multiple ranges into single range
    - Correctly inherit from `Stream` class
    - Fix `Content-Range` header in 416 responses when using `start`/`end` options
    - Fix `Content-Range` header missing from default 416 responses
    - Fix redirect error when `path` contains raw non-URL characters
    - Fix redirect when `path` starts with multiple forward slashes
    - Ignore non-byte `Range` headers
    - deps: http-errors@~1.5.0
    - deps: range-parser@~1.2.0
    - deps: statuses@~1.3.0
    - perf: remove argument reassignment
  * deps: serve-static@~1.11.1
    - Add `acceptRanges` option
    - Add `cacheControl` option
    - Attempt to combine multiple ranges into single range
    - Fix redirect error when `req.url` contains raw non-URL characters
    - Ignore non-byte `Range` headers
    - Use status code 301 for redirects
    - deps: send@0.14.1
  * deps: type-is@~1.6.13
    - Fix type error when given invalid type to match against
    - deps: mime-types@~2.1.11
  * deps: vary@~1.1.0
    - Only accept valid field names in the `field` argument
  * perf: use strict equality when possible

4.13.4 / 2016-01-21
===================

  * deps: content-disposition@0.5.1
    - perf: enable strict mode
  * deps: cookie@0.1.5
    - Throw on invalid values provided to `serialize`
  * deps: depd@~1.1.0
    - Support web browser loading
    - perf: enable strict mode
  * deps: escape-html@~1.0.3
    - perf: enable strict mode
    - perf: optimize string replacement
    - perf: use faster string coercion
  * deps: finalhandler@0.4.1
    - deps: escape-html@~1.0.3
  * deps: merge-descriptors@1.0.1
    - perf: enable strict mode
  * deps: methods@~1.1.2
    - perf: enable strict mode
  * deps: parseurl@~1.3.1
    - perf: enable strict mode
  * deps: proxy-addr@~1.0.10
    - deps: ipaddr.js@1.0.5
    - perf: enable strict mode
  * deps: range-parser@~1.0.3
    - perf: enable strict mode
  * deps: send@0.13.1
    - deps: depd@~1.1.0
    - deps: destroy@~1.0.4
    - deps: escape-html@~1.0.3
    - deps: range-parser@~1.0.3
  * deps: serve-static@~1.10.2
    - deps: escape-html@~1.0.3
    - deps: parseurl@~1.3.0
    - deps: send@0.13.1

4.13.3 / 2015-08-02
===================

  * Fix infinite loop condition using `mergeParams: true`
  * Fix inner numeric 
