
/**
 * Module dependencies.
 */

var express = require('../../');

var app = module.exports = express();

// Fake items

var items = [
    { name: 'foo' }
  , { name: 'bar' }
  , { name: 'baz' }
];

// Routes

app.get('/', function(req, res, next){
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.write('<p>Visit /item/2</p>');
  res.write('<p>Visit /item/2.json</p>');
  res.write('<p>Visit /item/2.xml</p>');
  res.end();
});

app.get('/item/:id.:format?', function(req, res, next){
  var id = req.params.id
    , format = req.params.format
    , item = items[id];
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
        res.type('xml').send(xml);
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

app.use(express.errorHandler());

if (!module.parent) {
  app.listen(3000);
  silent || console.log('Express started on port 3000');
}