
/**
 * Module dependencies.
 */

var express = require('./../../lib/express'),
    http = require('http');

var app = express.createServer();

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

app.get('/', function(req, res, params, next){
    var name = 'visionmedia';
    request('/repos/show/' + name, function(err, user){
        if (err) {
            next(err)
        } else {
            res.render('index.jade', {
                locals: {
                    repos: sort(user.repositories),
                    name: name
                }
            });
        }
    });
});

app.listen(3000);