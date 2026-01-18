# Express.js Middleware Patterns Guide

This document provides comprehensive guidance on Express.js middleware patterns including error handling, authentication, and logging. All examples are based on patterns found in the Express.js codebase.

## Table of Contents

- [Middleware Basics](#middleware-basics)
- [Error Handling Middleware](#error-handling-middleware)
- [Authentication Middleware](#authentication-middleware)
- [Logging Middleware](#logging-middleware)
- [Middleware Registration Order](#middleware-registration-order)
- [Route-Level Middleware](#route-level-middleware)
- [Router-Level Middleware](#router-level-middleware)
- [Best Practices](#best-practices)

---

## Middleware Basics

Express middleware functions have access to the request object (`req`), response object (`res`), and the `next` function. The signature is:

```javascript
function middleware(req, res, next) {
  // Perform operations
  next(); // Pass control to the next middleware
}
```

### Registering Middleware

```javascript
// Application-level middleware
app.use(middleware);

// Path-specific middleware
app.use('/api', apiMiddleware);

// Multiple middleware functions
app.use(fn1, fn2, fn3);

// Array of middleware
app.use([fn1, fn2, fn3]);
```

---

## Error Handling Middleware

Error-handling middleware requires **four arguments**: `(err, req, res, next)`. This arity of 4 distinguishes it from regular middleware.

### Basic Error Handler

From `examples/error/index.js`:

```javascript
function errorHandler(err, req, res, next) {
  // Log the error
  console.error(err.stack);

  // Respond with 500 "Internal Server Error"
  res.status(500);
  res.send('Internal Server Error');
}

// Error handlers must be placed AFTER all other routes and middleware
app.use(errorHandler);
```

### Custom Error Objects with Status Codes

From `examples/web-service/index.js`:

```javascript
// Create an error with a custom status
function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

// Usage in route
app.use('/api', function(req, res, next) {
  var key = req.query['api-key'];
  if (!key) return next(error(400, 'api key required'));
  if (apiKeys.indexOf(key) === -1) return next(error(401, 'invalid api key'));
  next();
});

// Handler uses err.status
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({ error: err.message });
});
```

### Content-Negotiated Error Responses

From `examples/error-pages/index.js`:

```javascript
// 404 handler - placed before error handler
app.use(function(req, res, next) {
  res.status(404);

  res.format({
    html: function() {
      res.render('404', { url: req.url });
    },
    json: function() {
      res.json({ error: 'Not found' });
    },
    default: function() {
      res.type('txt').send('Not found');
    }
  });
});

// Error handler (arity of 4)
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('500', { error: err });
});
```

### Route-Level Error Handling

Error handlers can be defined inline with routes:

```javascript
app.get('/', function(req, res, next) {
  next(new Error('fabricated error'));
}, function(req, res, next) {
  // This middleware is SKIPPED when error occurs
  next();
}, function(err, req, res, next) {
  // This error handler catches the error
  console.log('Caught:', err.message);
  next(err); // Optionally pass to next error handler
});
```

### Promise-Based Error Handling

Express supports async/await and promises:

```javascript
router.use(async function(req, res, next) {
  // Rejected promises are automatically caught
  return Promise.reject(new Error('boom!'));
});

router.use(function(err, req, res, next) {
  res.send('saw ' + err.name + ': ' + err.message);
});
```

---

## Authentication Middleware

### Session-Based Authentication

From `examples/auth/index.js`:

```javascript
var session = require('express-session');
var hash = require('pbkdf2-password')();

// Session middleware
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'shhhh, very secret'
}));

// Restrict access middleware
function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

// Apply to protected routes
app.get('/restricted', restrict, function(req, res) {
  res.send('Welcome to the restricted area!');
});

// Login handler with session regeneration
app.post('/login', function(req, res, next) {
  authenticate(req.body.username, req.body.password, function(err, user) {
    if (err) return next(err);
    if (user) {
      // Regenerate session to prevent fixation attacks
      req.session.regenerate(function() {
        req.session.user = user;
        res.redirect('/');
      });
    } else {
      req.session.error = 'Authentication failed';
      res.redirect('/login');
    }
  });
});

// Logout
app.get('/logout', function(req, res) {
  req.session.destroy(function() {
    res.redirect('/');
  });
});
```

### Cookie Session (Lightweight)

From `examples/cookie-sessions/index.js`:

```javascript
var cookieSession = require('cookie-session');

app.use(cookieSession({ secret: 'manny is cool' }));

app.get('/', function(req, res) {
  req.session.count = (req.session.count || 0) + 1;
  res.send('viewed ' + req.session.count + ' times\n');
});
```

### API Key Authentication

From `examples/web-service/index.js`:

```javascript
var apiKeys = ['foo', 'bar', 'baz'];

// Mount API key validation to /api path
app.use('/api', function(req, res, next) {
  var key = req.query['api-key'];

  if (!key) return next(error(400, 'api key required'));
  if (apiKeys.indexOf(key) === -1) return next(error(401, 'invalid api key'));

  req.key = key;
  next();
});

// Protected API routes
app.get('/api/users', function(req, res) {
  res.send(users);
});
```

### Role-Based Access Control

From `examples/route-middleware/index.js`:

```javascript
function loadUser(req, res, next) {
  var user = users[req.params.id];
  if (user) {
    req.user = user;
    next();
  } else {
    next(new Error('Failed to load user ' + req.params.id));
  }
}

function andRestrictToSelf(req, res, next) {
  if (req.authenticatedUser.id === req.user.id) {
    next();
  } else {
    next(new Error('Unauthorized'));
  }
}

function andRestrictTo(role) {
  return function(req, res, next) {
    if (req.authenticatedUser.role === role) {
      next();
    } else {
      next(new Error('Unauthorized'));
    }
  };
}

// Composable middleware chains
app.get('/user/:id', loadUser, function(req, res) {
  res.send('Viewing user ' + req.user.name);
});

app.get('/user/:id/edit', loadUser, andRestrictToSelf, function(req, res) {
  res.send('Editing user ' + req.user.name);
});

app.delete('/user/:id', loadUser, andRestrictTo('admin'), function(req, res) {
  res.send('Deleted user ' + req.user.name);
});
```

---

## Logging Middleware

Express uses [morgan](https://github.com/expressjs/morgan) for HTTP request logging.

### Basic Usage

```javascript
var morgan = require('morgan');

// Development format - colored output
app.use(morgan('dev'));

// Combined format - Apache-style logs
app.use(morgan('combined'));

// Custom format
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
```

### Conditional Logging

From `examples/error/index.js`:

```javascript
var test = app.get('env') === 'test';

// Skip logging in test environment
if (!test) app.use(morgan('dev'));
```

### Environment-Based Configuration

From `examples/error-pages/index.js`:

```javascript
var silent = process.env.NODE_ENV === 'test';

silent || app.use(morgan('dev'));
```

---

## Middleware Registration Order

The order of middleware registration is critical:

```javascript
var express = require('express');
var app = express();

// 1. Logging (first - to log all requests)
app.use(morgan('dev'));

// 2. Static files (before body parsing for efficiency)
app.use(express.static('public'));

// 3. Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Session/Cookie parsing
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));

// 5. Authentication
app.use(passport.initialize());
app.use(passport.session());

// 6. Application routes
app.get('/', function(req, res) {
  res.send('Hello World');
});

app.use('/api', apiRouter);

// 7. 404 handler (after all routes)
app.use(function(req, res, next) {
  res.status(404).send('Not Found');
});

// 8. Error handler (LAST - must have 4 arguments)
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

---

## Route-Level Middleware

### Inline Middleware

```javascript
app.get('/user/:id',
  function(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    next();
  },
  function(req, res, next) {
    console.log('Request Type:', req.method);
    next();
  },
  function(req, res) {
    res.send('User Info');
  }
);
```

### Param Middleware

From `examples/params/index.js`:

```javascript
// Convert :to and :from to integers
app.param(['to', 'from'], function(req, res, next, num, name) {
  req.params[name] = parseInt(num, 10);
  if (isNaN(req.params[name])) {
    next(createError(400, 'failed to parseInt ' + num));
  } else {
    next();
  }
});

// Load user by id
app.param('user', function(req, res, next, id) {
  req.user = users[id];
  if (req.user) {
    next();
  } else {
    next(createError(404, 'failed to find user'));
  }
});
```

---

## Router-Level Middleware

### Creating Modular Routers

From `examples/multi-router/`:

```javascript
// api_v1.js
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('Hello from APIv1 root route.');
});

router.get('/users', function(req, res) {
  res.send('List of APIv1 users.');
});

module.exports = router;

// Main app
var app = express();
app.use('/api/v1', require('./controllers/api_v1'));
app.use('/api/v2', require('./controllers/api_v2'));
```

### Router with Middleware

```javascript
var router = express.Router();

// Middleware specific to this router
router.use(function(req, res, next) {
  console.log('Time:', Date.now());
  next();
});

router.get('/', function(req, res) {
  res.send('Home page');
});

app.use('/', router);
```

---

## Best Practices

### 1. Always Call `next()` or Send a Response

```javascript
// GOOD: Calls next() to pass control
app.use(function(req, res, next) {
  req.requestTime = Date.now();
  next();
});

// GOOD: Sends response
app.get('/', function(req, res) {
  res.send('Hello');
});

// BAD: Does neither - request hangs
app.use(function(req, res, next) {
  console.log('Logging...');
  // Request will hang!
});
```

### 2. Use Error-First Callbacks

```javascript
app.get('/user/:id', function(req, res, next) {
  db.findUser(req.params.id, function(err, user) {
    if (err) return next(err); // Pass errors to error handler
    if (!user) return next(createError(404, 'User not found'));
    res.json(user);
  });
});
```

### 3. Separate Concerns

```javascript
// GOOD: Separate middleware functions
function validateInput(req, res, next) { /* ... */ }
function authenticate(req, res, next) { /* ... */ }
function authorize(req, res, next) { /* ... */ }

app.post('/api/resource', validateInput, authenticate, authorize, createResource);
```

### 4. Use Environment-Specific Configuration

```javascript
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
  app.enable('verbose errors');
}

if (app.get('env') === 'production') {
  app.use(morgan('combined'));
  app.disable('verbose errors');
  app.enable('view cache');
}
```

### 5. Secure Session Configuration

```javascript
app.use(session({
  secret: process.env.SESSION_SECRET, // Use environment variable
  resave: false,                       // Don't save unchanged sessions
  saveUninitialized: false,            // Don't create empty sessions
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,                    // Prevent XSS
    maxAge: 24 * 60 * 60 * 1000        // 24 hours
  }
}));
```

### 6. Graceful Error Handling

```javascript
// Development error handler - shows stack trace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// Production error handler - no stack traces
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});
```

---

## References

- [Express.js Official Documentation](https://expressjs.com/)
- [Express.js Examples](https://github.com/expressjs/express/tree/master/examples)
- [Morgan Logger](https://github.com/expressjs/morgan)
- [Express Session](https://github.com/expressjs/session)
- [Cookie Session](https://github.com/expressjs/cookie-session)
