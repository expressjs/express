
const express = require('..');
const app = express();

// number of middleware

let n = parseInt(process.env.MW || '1', 10);
console.log('  %s middleware', n);

while (n--) {
  app.use((req, res, next) => {
    next();
  });
}

app.use((req, res, next) => {
  res.send('Hello World')
});

app.listen(3333);
