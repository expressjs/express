'use strict';

const express = require('express');
const app = express();


const cacheMiddleware = require('./lib/cache');  

app.use(cacheMiddleware);

app.get('/', (req, res) => {
  res.send('Hello Ruchira! ' + new Date().toISOString());
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
