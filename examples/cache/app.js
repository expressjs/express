
// Expose modules in ./support for demo purposes
require.paths.unshift(__dirname + '/../../support');

/**
 * Module dependencies.
 */

var express = require('./../../lib/express')
  , redis = require('redis')
  , _cache = redis.createClient()
  , app = express.createServer();

// $ npm install redis
// if you do not have the redis client installed
// and start redis via $ redis-server

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Generate 50 random users for display
var n = 50;
var users = [];
while (n--) {
  users.push({ name: 'user ' + n, email: n + '@vision-media.ca' });
}

// example cache middleware. we proxy writeHead etc to
// cache the response, and we could perform additional
// checks on headers etc to extend our caching logic.
//
// Please note in this example you would have to
// handle write() encodings as well, this is just an example :)

function cache(req, res, next){
  _cache.get(req.url, function(err, data){
    try {
      if (data) {
        data = JSON.parse(data.toString());
        delete data.headers['X-Response-Time'];
        res.writeHead(data.status, data.headers);
        res.end(data.body);
      } else {
        proxyCache(req, res);
        next();
      }
    } catch (err) {
      // Ignore
      next();
    }
  });
}

function proxyCache(req, res){
  var writeHead = res.writeHead
    , write = res.write
    , end = res.end
    , ok = false
    , cache = { body: '' };

  // Proxy writeHead
  res.writeHead = function(status, headers){
    res.writeHead = writeHead;
    res.writeHead(status, headers);
    if (status >= 300) return ok = false;
    cache.status = status;
    cache.headers = headers;
  };

  // Proxy write
  res.write = function(data){
    res.write = write;
    cache.body += data;
    res.write(data);
  };
  
  // Proxy write
  res.end = function(data){
    res.end = end;
    cache.body += data;
    res.end(data);
    
    // Serialize / cache data
    _cache.set(req.url, JSON.stringify(cache));
  };
}

// Apply to any route(s) as route-specific middleware

app.get('/', cache, function(req, res){
  res.render('users', { users: users });
});

app.listen(3000);
console.log('Express app started on port 3000');