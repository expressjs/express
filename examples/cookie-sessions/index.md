## Install

```bash
$ npm install cookie-session
```

## API

```js
var cookieSession = require('cookie-session')
```

### cookieSession(options)

Create a new cookie session middleware with the provided options. This middleware
will attach the property `session` to `req`, which provides an object representing
the loaded session. This session is either a new session if no valid session was
provided in the request, or a loaded session from the request.

The middleware will automatically add a `Set-Cookie` header to the response if the
contents of `req.session` were altered. _Note_ that no `Set-Cookie` header will be
in the response (and thus no session created for a specific user) unless there are
contents in the session, so be sure to add something to `req.session` as soon as
you have identifying information to store for the session.


## Example

### Simple view counter example

```js
var cookieSession = require('cookie-session')
var express = require('express')

var app = express()

app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.use(function (req, res, next) {
  // Update views
  req.session.views = (req.session.views || 0) + 1

  // Write response
  res.end(req.session.views + ' views')
})

app.listen(3000)
```

for information about cookie-session, please visit [here](https://github.com/expressjs/cookie-session)





