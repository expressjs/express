
/**
 * Module dependencies.
 */

var express = require('../../lib/express')
  , http = require('http');

var app = express();

// Expose our views

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

/**
 * Request github json api `path`.
 *
 * @param {String} path
 * @param {Function} fn
 * @api public
 */

function request(path, fn){
  var client = http.createClient(80, 'github.com')
    , req = client.request('GET', '/api/v2/json' + path, { Host: 'github.com' });
  req.on('response', function(res){
    res.body = '';
    res.on('data', function(chunk){ res.body += chunk; });
    res.on('end', function(){
      try {
        fn(null, JSON.parse(res.body));
      } catch (err) {
        fn(err);
      }
    });
  });
  req.end();
}

/**
 * Sort repositories by watchers desc.
 *
 * @param {Array} repos
 * @api public
 */

function sort(repos){
  return repos.sort(function(a, b){
    if (a.watchers == b.watchers) return 0;
    if (a.watchers > b.watchers) return -1;
    if (a.watchers < b.watchers) return 1;
  });
}

/**
 * Tally up total watchers.
 *
 * @param {Array} repos
 * @return {Number}
 * @api public
 */

function totalWatchers(repos) {
  return repos.reduce(function(sum, repo){
    return sum + repo.watchers;
  }, 0);
}

/**
 * Default to my user name :)
 */

app.get('/', function(req, res){
  res.redirect('/repos/visionmedia');
});

/**
 * Display repos.
 */

app.get('/repos/*', function(req, res, next){
  var names = req.params[0].split('/')
    , users = [];
  (function fetchData(name){
    // We have a user name
    if (name) {
      console.log('... fetching \x1b[33m%s\x1b[0m', name);
      request('/repos/show/' + name, function(err, user){
        if (err) {
          next(err)
        } else {
          user.totalWatchers = totalWatchers(user.repositories);
          user.repos = sort(user.repositories);
          user.name = name;
          users.push(user);
          fetchData(names.shift());
        }
      });
    // No more users
    } else {
      console.log('... done');
      res.render('index', { users: users });
    }
  })(names.shift());
});

// Serve statics from ./public
app.use(express.static(__dirname + '/public'));

// Listen on port 3000
app.listen(3000);
console.log('Express app started on port 3000');