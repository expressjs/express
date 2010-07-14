
/**
 * Module dependencies.
 */

var express = require('./../../lib/express'),
    connect = require('connect'),
    http = require('http');

// Setup server with redirect middleware,
// providing us with res.redirect()

var app = express.createServer(
    connect.redirect()
);

// Expose our views

app.set('views', __dirname + '/views');

/**
 * Request github json api `path`.
 *
 * @param {String} path
 * @param {Function} fn
 * @api public
 */

function request(path, fn){
    var client = http.createClient(80, 'github.com'),
        req = client.request('GET', '/api/v2/json' + path, { Host: 'github.com' });
    req.addListener('response', function(res){
        res.body = '';
        res.addListener('data', function(chunk){ res.body += chunk; });
        res.addListener('end', function(){
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

app.get('/repos/:user', function(req, res, params, next){
    var name = params.user;
    request('/repos/show/' + name, function(err, user){
        if (err) {
            next(err)
        } else {
            res.render('index.jade', {
                locals: {
                    totalWatchers: totalWatchers(user.repositories),
                    repos: sort(user.repositories),
                    name: name
                }
            });
        }
    });
});

// Serve statics from ./public
app.use('/', connect.staticProvider(__dirname + '/public'));

// Listen on port 3000
app.listen(3000);