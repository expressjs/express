'use strict'

/**
 * Module dependencies.
 */

var express = require('../../'); // Import from the root of the repo
var app = express();

// 1. Global Logging Middleware
// This runs for EVERY request
app.use(function logger(req, res, next) {
  console.log('\n--- New Request ---');
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('1. Global Logger: Start');
  
  // Hook into response finish to log completion
  res.on('finish', () => {
    console.log('1. Global Logger: Response Sent');
  });
  
  next();
});

// 2. Middleware that modifies the request
app.use(function addTimestamp(req, res, next) {
  console.log('2. Timestamp Middleware: Adding req.requestTime');
  req.requestTime = Date.now();
  next();
});

// 3. Route-specific middleware example
function validateId(req, res, next) {
  console.log('   -> ValidateID Middleware: Checking ID...');
  if (req.params.id === '0') {
    console.log('   -> ValidateID Middleware: ID is 0, throwing error');
    return next(new Error('ID cannot be 0'));
  }
  console.log('   -> ValidateID Middleware: ID is valid');
  next();
}

// Route with multiple middleware
app.get('/user/:id', 
  validateId, 
  function userHandler(req, res, next) {
    console.log('3. Route Handler: Executing');
    res.send(`User ID: ${req.params.id}, Requested at: ${req.requestTime}`);
    console.log('3. Route Handler: Finished (response sent)');
    // Note: We don't call next() here because we sent a response.
  }
);

// 4. Async Middleware (Express 5 feature)
// Express 5 automatically catches errors in async functions
app.get('/async-error', async function asyncThrower(req, res, next) {
  console.log('4. Async Handler: Start');
  // Simulating an async operation that fails
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('4. Async Handler: Throwing error');
  throw new Error('Something went wrong in async land!');
});

// 5. Router-level middleware
var apiRouter = express.Router();

apiRouter.use(function apiLogger(req, res, next) {
  console.log('   [API Router] Logger: Start');
  next();
});

apiRouter.get('/data', function(req, res) {
  console.log('   [API Router] Handler');
  res.json({ message: 'Hello from API' });
});

app.use('/api', apiRouter);

// 6. 404 Handler (Matched if no other route matches)
app.use(function notFound(req, res, next) {
  console.log('5. 404 Handler: No route matched');
  res.status(404).send('Sorry, cant find that!');
});

// 7. Error Handling Middleware
// MUST have 4 arguments: (err, req, res, next)
app.use(function errorHandler(err, req, res, next) {
  console.error('6. Error Handler: Caught error:', err.message);
  res.status(500).send({ error: err.message });
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
  console.log('Try these URLs:');
  console.log('  GET http://localhost:3000/user/123');
  console.log('  GET http://localhost:3000/user/0 (Triggers error)');
  console.log('  GET http://localhost:3000/async-error (Triggers async error)');
  console.log('  GET http://localhost:3000/api/data (Router middleware)');
  console.log('  GET http://localhost:3000/unknown (404)');
}
