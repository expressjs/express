var express = require('../..');
var app = module.exports = express();

var limiter = rateLimit({
  ttl: 5 * 60 * 1000, // 5 minutes
  max: 200, // Limit each IP to 200 requests per window
  message: { // Type of message is any (string, object or etc)
    code: 409,
    message: "you reached the limit"
  }
});

// add limiter as middleware.
app.use(limiter);

//
app.get('/', (req, res) => {
  res.send('Hello from root!');
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
