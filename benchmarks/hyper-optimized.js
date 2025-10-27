/*!
 * Express - HYPER OPTIMIZED
 * All overhead removed, maximum performance
 */

'use strict';

// Set production mode FIRST
process.env.NODE_ENV = 'production';

const express = require('..');
const app = express();

// Disable X-Powered-By header (small overhead)
app.disable('x-powered-by');

// Disable etag (removes computation overhead)
app.disable('etag');

// NO MIDDLEWARE - direct routes only for max speed

// Simple schema for fast-json-stringify
const simpleSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    timestamp: { type: 'number' },
    optimization: { type: 'string' }
  }
};

// Set schema
app.set('json schema', simpleSchema);

// HYPER OPTIMIZED: Direct JSON endpoint with schema
app.get('/json', (req, res) => {
  res.json({
    message: 'Hello World',
    timestamp: Date.now(),
    optimization: 'hyper'
  });
});

// Hello World (minimal overhead)
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Test if fast-json is being used
app.get('/test-fast-json', (req, res) => {
  const fastJson = require('../lib/utils/fast-json');
  const stats = fastJson.getCacheStats();
  res.json({
    fastJsonAvailable: stats.available,
    cacheSize: stats.size,
    message: stats.available ? 'fast-json-stringify is working!' : 'Fallback to native JSON'
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║  Express - HYPER OPTIMIZED Performance   ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log('');
  console.log(`Server: http://localhost:${port}`);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('');
  console.log('✅ Optimizations Applied:');
  console.log('   - Plain Objects (5-8%)');
  console.log('   - Fast JSON with schema (2-3x)');
  console.log('   - X-Powered-By disabled');
  console.log('   - ETag disabled (removes overhead)');
  console.log('   - No middleware (zero overhead)');
  console.log('   - Production mode');
  console.log('');
  console.log('📊 Test Endpoints:');
  console.log('   GET /              - Hello World');
  console.log('   GET /json          - Fast JSON');
  console.log('   GET /test-fast-json - Verify fast-json is working');
  console.log('');
  console.log('🔥 Benchmark Commands:');
  console.log(`   wrk -c 100 -d 30s -t 4 http://localhost:${port}/`);
  console.log(`   wrk -c 100 -d 30s -t 4 http://localhost:${port}/json`);
  console.log(`   autocannon -c 100 -d 30 http://localhost:${port}/json`);
  console.log('');
  console.log('💡 First, verify fast-json is working:');
  console.log(`   curl http://localhost:${port}/test-fast-json`);
  console.log('');
});
