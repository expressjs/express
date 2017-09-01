var isHttp2Supported = require('../../lib/utils').isHttp2Supported;
if (!isHttp2Supported) {
  return;
}
var fs = require('fs');
var path = require('path');
var express = require('../../');
var http2 = require('http2');
var keys = path.join(__dirname, 'keys');
var app = express();
var style = fs.readFileSync('./static/style.css', 'utf8');
function pushStyle(res) {
  res.createPushResponse({':path': '/style.css',
   ':status': 200,
    'content-type': 'text/css'}, function(err, newResponse) {   
      newResponse.setHeader('content-type', 'text/css');
      newResponse.end(style);
  });
}

app.get('/', function(req, res, next){
  pushStyle(res);
  next();
});
app.get('/index.html', function(req, res, next) {
  pushStyle(res);
  next();
})
app.use(express.static('static'));

var server = http2.createSecureServer({
  key: fs.readFileSync(path.join(keys, 'test_key.pem')),
  cert: fs.readFileSync(path.join(keys, 'test_cert.pem'))
}, app);
/* istanbul ignore next */
if (!module.parent) {
  server.listen(3000);
  console.log('Express started on port 3000');
}
