
const express = process.env.NO_LOCAL_EXPRESS === "true" ? require('express') : require('..');
const app = express();

// number of middleware

let n = parseInt(process.env.MW || '1', 10);
console.log('  %s middleware', n);

while (n--) {
  app.use(function(req, res, next){
    next();
  });
}

app.use(function(req, res){
  res.send('Hello World')
});

app.listen(3333);
