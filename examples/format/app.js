
/**
 * Module dependencies.
 */

var express = require('../../lib/express');

var app = express.createServer();

// Fake items

var items = [
    { name: 'foo' },
    { name: 'bar' },
    { name: 'baz' }
];

// Routes

app.get('/', function(req, res, next){
    res.send('Visit /item/2');
});

app.get('/item/:id.:format?', function(req, res, next){
    var id = req.params.id,
        format = req.params.format,
        item = items[id];
    console.dir(req.params)
    // Ensure item exists
    if (item) {
        switch (format) {
            case 'json':
                res.send(item);
                break;
            case 'html':
            default:
                res.send('<h1>' + item.name + '</h1>');
        }
    } else {
        // We could simply pass route control and potentially 404
        // by calling next(), or pass an exception like below.
        next(new Error('Item ' + id + ' does not exist'));
    }
});

// Middleware

app.use(express.errorHandler({ showStack: true }));

app.listen(3000);