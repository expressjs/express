const express = require('../../');

const app = express();

app.get('/', function(req, res) {
  res.send('Hello World');
});

/* istanbul ignore next */
if (module.children) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
