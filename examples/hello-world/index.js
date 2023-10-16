'use strict';

const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

/* istanbul ignore next */
if (!module.parent) {
  const port = process.env.PORT || 3000; // Use the provided port or default to 3000
  app.listen(port, () => {
    console.log(`Express started on port ${port}`);
  });
}

module.exports = app; // Export the Express app to use it elsewhere
