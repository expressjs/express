'use strict';

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Express started on port ${PORT}`);
});

module.exports = app; // Good for testing if needed
