'use strict';

var express = require('./');

console.log('Testing header-based routing...');

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

function testCase(name, headers, expected) {
  console.log('\nTest: ' + name);
  var initialLength = results.length;

  var req = {
    url: '/test',
    method: 'GET',
    headers: headers || {}
  };

  var res = {
    end: function () {},
    json: function () {}
  };

  app.handle(req, res, function (err) {
    if (err) {
      console.log('  Error:', err);
    }
  });

  var actual = results.slice(initialLength);
  console.log('  Expected:', expected);
  console.log('  Actual:', actual);

  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    console.log('  ✓ PASS');
    return true;
  } else {
    console.log('  ✗ FAIL');
    return false;
  }
}

var allPassed = true;

allPassed = testCase('Header v1.0 matches v1 route', { 'x-api-version': '1.0' }, ['v1']) && allPassed;
allPassed = testCase('Header v2.0 matches v2 route', { 'x-api-version': '2.0' }, ['v2']) && allPassed;
allPassed = testCase('Missing header falls back to default', {}, ['default']) && allPassed;
allPassed = testCase('Unknown version falls back to default', { 'x-api-version': '99.0' }, ['default']) && allPassed;

console.log('\n' + (allPassed ? 'All tests passed!' : 'Some tests failed!'));
process.exit(allPassed ? 0 : 1);
