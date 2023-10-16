'use strict';

const express = require('express');
const app = express();
const port = 3000;

// Use JSON parsing middleware for incoming requests
app.use(express.json());

// Define your API routes
const apiV1Router = require('./controllers/api_v1');
const apiV2Router = require('./controllers/api_v2');

app.use('/api/v1', apiV1Router);
app.use('/api/v2', apiV2Router);

// Define a root route
app.get('/', (req, res) => {
  res.send('Hello from root route.');
});

// Handle 404 errors (route not found)
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

// Handle other errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start the server
app.listen(port, () => {
  console.log(`Express Server Started on port ${port}`);
});
