'use strict';

var express = require('./');

console.log('Testing header-based routing at Router level...');

var allPassed = true;

function testCase(name, testFn) {
  console.log('\nTest: ' + name);
  try {
    var result = testFn();
    if (result === true || result === undefined) {
      console.log('  ✓ PASS');
      return true;
    } else {
      console.log('  ✗ FAIL');
      return false;
    }
  } catch (err) {
    console.log('  ✗ FAIL:', err.message);
    return false;
  }
}

allPassed = testCase('Router.get with headers option - exact string match', function() {
  var Router = express.Router;
  var router = new Router();
  var results = [];

  router.get('/test', { headers: { 'X-API-Version': '1.0' } }, function (req, res) {
    results.push('v1');
  });

  router.get('/test', { headers: { 'X-API-Version': '2.0' } }, function (req, res) {
    results.push('v2');
  });

  router.get('/test', function (req, res) {
    results.push('default');
  });

  var req1 = { url: '/test', method: 'GET', headers: { 'x-api-version': '1.0' } };
  var req2 = { url: '/test', method: 'GET', headers: { 'x-api-version': '2.0' } };
  var req3 = { url: '/test', method: 'GET', headers: {} };
  var res = { end: function () {} };

  router.handle(req1, res, function() {});
  router.handle(req2, res, function() {});
  router.handle(req3, res, function() {});

  console.log('  Results:', results);
  if (results[0] !== 'v1') throw new Error('Expected v1, got ' + results[0]);
  if (results[1] !== 'v2') throw new Error('Expected v2, got ' + results[1]);
  if (results[2] !== 'default') throw new Error('Expected default, got ' + results[2]);
  return true;
}) && allPassed;

allPassed = testCase('Router.get with headers option - regex match', function() {
  var Router = express.Router;
  var router = new Router();
  var results = [];

  router.get('/test', { headers: { 'Accept': /^application\/json/ } }, function (req, res) {
    results.push('json');
  });

  router.get('/test', { headers: { 'Accept': /^text\/html/ } }, function (req, res) {
    results.push('html');
  });

  router.get('/test', function (req, res) {
    results.push('default');
  });

  var req1 = { url: '/test', method: 'GET', headers: { 'accept': 'application/json' } };
  var req2 = { url: '/test', method: 'GET', headers: { 'accept': 'text/html' } };
  var res = { end: function () {} };

  router.handle(req1, res, function() {});
  router.handle(req2, res, function() {});

  console.log('  Results:', results);
  if (results[0] !== 'json') throw new Error('Expected json, got ' + results[0]);
  if (results[1] !== 'html') throw new Error('Expected html, got ' + results[1]);
  return true;
}) && allPassed;

allPassed = testCase('Router.get with headers option - function match', function() {
  var Router = express.Router;
  var router = new Router();
  var results = [];

  router.get('/test', { 
    headers: { 
      'X-API-Version': function(val) { return parseInt(val, 10) < 2; } 
    } 
  }, function (req, res) {
    results.push('old');
  });

  router.get('/test', { 
    headers: { 
      'X-API-Version': function(val) { return parseInt(val, 10) >= 2; } 
    } 
  }, function (req, res) {
    results.push('new');
  });

  var req1 = { url: '/test', method: 'GET', headers: { 'x-api-version': '1' } };
  var req2 = { url: '/test', method: 'GET', headers: { 'x-api-version': '2' } };
  var res = { end: function () {} };

  router.handle(req1, res, function() {});
  router.handle(req2, res, function() {});

  console.log('  Results:', results);
  if (results[0] !== 'old') throw new Error('Expected old, got ' + results[0]);
  if (results[1] !== 'new') throw new Error('Expected new, got ' + results[1]);
  return true;
}) && allPassed;

allPassed = testCase('Router.route with headers option', function() {
  var Router = express.Router;
  var router = new Router();
  var results = [];

  router.route('/test', { headers: { 'X-API-Version': '1.0' } })
    .get(function (req, res) {
      results.push('v1-get');
    })
    .post(function (req, res) {
      results.push('v1-post');
    });

  router.route('/test', { headers: { 'X-API-Version': '2.0' } })
    .get(function (req, res) {
      results.push('v2-get');
    });

  var req1 = { url: '/test', method: 'GET', headers: { 'x-api-version': '1.0' } };
  var req2 = { url: '/test', method: 'POST', headers: { 'x-api-version': '1.0' } };
  var req3 = { url: '/test', method: 'GET', headers: { 'x-api-version': '2.0' } };
  var res = { end: function () {} };

  router.handle(req1, res, function() {});
  router.handle(req2, res, function() {});
  router.handle(req3, res, function() {});

  console.log('  Results:', results);
  if (results[0] !== 'v1-get') throw new Error('Expected v1-get, got ' + results[0]);
  if (results[1] !== 'v1-post') throw new Error('Expected v1-post, got ' + results[1]);
  if (results[2] !== 'v2-get') throw new Error('Expected v2-get, got ' + results[2]);
  return true;
}) && allPassed;

allPassed = testCase('Router.all with headers option', function() {
  var Router = express.Router;
  var router = new Router();
  var results = [];

  router.all('/test', { headers: { 'X-API-Version': '1.0' } }, function (req, res) {
    results.push(req.method + '-v1');
  });

  var req1 = { url: '/test', method: 'GET', headers: { 'x-api-version': '1.0' } };
  var req2 = { url: '/test', method: 'POST', headers: { 'x-api-version': '1.0' } };
  var req3 = { url: '/test', method: 'GET', headers: { 'x-api-version': '2.0' } };
  var res = { end: function () {} };

  router.handle(req1, res, function() {});
  router.handle(req2, res, function() {});
  router.handle(req3, res, function() {});

  console.log('  Results:', results);
  if (results[0] !== 'GET-v1') throw new Error('Expected GET-v1, got ' + results[0]);
  if (results[1] !== 'POST-v1') throw new Error('Expected POST-v1, got ' + results[1]);
  if (results.length !== 2) throw new Error('Expected only 2 results, got ' + results.length);
  return true;
}) && allPassed;

allPassed = testCase('App.get with headers option - backward compatibility', function() {
  var app = express();
  var results = [];

  app.get('/test', { headers: { 'X-API-Version': '1.0' } }, function (req, res) {
    results.push('v1');
  });

  app.get('/test', { headers: { 'X-API-Version': '2.0' } }, function (req, res) {
    results.push('v2');
  });

  app.get('/test', function (req, res) {
    results.push('default');
  });

  var req1 = { url: '/test', method: 'GET', headers: { 'x-api-version': '1.0' } };
  var req2 = { url: '/test', method: 'GET', headers: { 'x-api-version': '2.0' } };
  var req3 = { url: '/test', method: 'GET', headers: {} };
  var res = { end: function () {} };

  app.handle(req1, res, function() {});
  app.handle(req2, res, function() {});
  app.handle(req3, res, function() {});

  console.log('  Results:', results);
  if (results[0] !== 'v1') throw new Error('Expected v1, got ' + results[0]);
  if (results[1] !== 'v2') throw new Error('Expected v2, got ' + results[1]);
  if (results[2] !== 'default') throw new Error('Expected default, got ' + results[2]);
  return true;
}) && allPassed;

allPassed = testCase('Router with multiple header conditions', function() {
  var Router = express.Router;
  var router = new Router();
  var results = [];

  router.get('/test', {
    headers: {
      'X-API-Version': '1.0',
      'Accept': 'application/json'
    }
  }, function (req, res) {
    results.push('v1-json');
  });

  router.get('/test', {
    headers: {
      'X-API-Version': '1.0',
      'Accept': 'text/html'
    }
  }, function (req, res) {
    results.push('v1-html');
  });

  var req1 = { url: '/test', method: 'GET', headers: { 'x-api-version': '1.0', 'accept': 'application/json' } };
  var req2 = { url: '/test', method: 'GET', headers: { 'x-api-version': '1.0', 'accept': 'text/html' } };
  var res = { end: function () {} };

  router.handle(req1, res, function() {});
  router.handle(req2, res, function() {});

  console.log('  Results:', results);
  if (results[0] !== 'v1-json') throw new Error('Expected v1-json, got ' + results[0]);
  if (results[1] !== 'v1-html') throw new Error('Expected v1-html, got ' + results[1]);
  return true;
}) && allPassed;

allPassed = testCase('Router.post with headers option', function() {
  var Router = express.Router;
  var router = new Router();
  var results = [];

  router.post('/test', { headers: { 'X-API-Version': '1.0' } }, function (req, res) {
    results.push('v1');
  });

  router.post('/test', { headers: { 'X-API-Version': '2.0' } }, function (req, res) {
    results.push('v2');
  });

  var req1 = { url: '/test', method: 'POST', headers: { 'x-api-version': '1.0' } };
  var req2 = { url: '/test', method: 'POST', headers: { 'x-api-version': '2.0' } };
  var res = { end: function () {} };

  router.handle(req1, res, function() {});
  router.handle(req2, res, function() {});

  console.log('  Results:', results);
  if (results[0] !== 'v1') throw new Error('Expected v1, got ' + results[0]);
  if (results[1] !== 'v2') throw new Error('Expected v2, got ' + results[1]);
  return true;
}) && allPassed;

allPassed = testCase('Router - headers not match skips to next route', function() {
  var Router = express.Router;
  var router = new Router();
  var results = [];

  router.get('/test', { headers: { 'X-API-Version': 'nonexistent' } }, function (req, res) {
    results.push('wrong');
  });

  router.get('/test', function (req, res) {
    results.push('correct');
  });

  var req = { url: '/test', method: 'GET', headers: { 'x-api-version': '1.0' } };
  var res = { end: function () {} };

  router.handle(req, res, function() {});

  console.log('  Results:', results);
  if (results[0] !== 'correct') throw new Error('Expected correct, got ' + results[0]);
  if (results.length !== 1) throw new Error('Expected only 1 result, got ' + results.length);
  return true;
}) && allPassed;

allPassed = testCase('Router - backward compatibility without headers option', function() {
  var Router = express.Router;
  var router = new Router();
  var results = [];

  router.get('/test', function (req, res) {
    results.push('normal');
  });

  var req = { url: '/test', method: 'GET', headers: {} };
  var res = { end: function () {} };

  router.handle(req, res, function() {});

  console.log('  Results:', results);
  if (results[0] !== 'normal') throw new Error('Expected normal, got ' + results[0]);
  return true;
}) && allPassed;

console.log('\n' + (allPassed ? 'All tests passed!' : 'Some tests failed!'));
process.exit(allPassed ? 0 : 1);
