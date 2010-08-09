
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
    // Ensure item exists
    if (item) {
        // Serve the format
        switch (format) {
            case 'json':
                // Detects json
                res.send(item);
                break;
            case 'xml':
                // Set contentType as xml then sends
                // the string
                var xml = ''
                    + '<items>'
                    + '<item>' + item.name + '</item>'
                    + '</items>';
                res.contentType('.xml');
                res.send(xml);
                break;
            case 'html':
            default:
                // By default send some hmtl
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