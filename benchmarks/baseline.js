/*!
 * Express - BASELINE (No Optimizations)
 * Pure vanilla Express for comparison
 */

'use strict';

const express = require('..');
const app = express();

// Simple JSON endpoint
app.get('/json', (req, res) => {
  res.json({
    message: 'Hello World',
    timestamp: Date.now(),
    optimization: 'none'
  });
});

// Hello World
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  Express - BASELINE (No Optimizations)   ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
  console.log(`Server: http://localhost:${port}`);
  console.log('');
  console.log('❌ No Optimizations Applied');
  console.log('');
  console.log('Benchmark: wrk -c 100 -d 30s -t 4 http://localhost:${port}/json');
  console.log('');
});
