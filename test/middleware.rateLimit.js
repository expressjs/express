const express = require('../');
const request = require('supertest');
const rateLimit = require('../lib/middleware/rateLimit');


describe('Rate Limiting Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();

    // Configure rate limiter with small limits for testing
    const limiter = rateLimit({
      ttl: 1000, // 1 second window
      max: 3, // Limit each IP to 3 requests per window
      message: 'Too many requests from this IP.',
    });

    app.use(limiter);

    app.get('/', (req, res) => {
      res.status(200).send('Hello, world!');
    });
  });

  it('should allow requests within the limit', async () => {
    // Make 3 requests and expect them all to pass
    for (let i = 0; i < 3; i++) {
      request(app).get('/').expect('Hello, world!').expect(200);
    }
  });

  it('should block requests exceeding the limit', async () => {
    // Make 3 requests to reach the limit
    for (let i = 0; i < 3; i++) {
      await request(app).get('/');
    }

    // 4th request should be blocked
    request(app).get('/').expect('Too many requests from this IP.').expect(429);
  });

  it('should reset the limit after the window expires', async function () {
    this.timeout(3000); // Increase timeout for testing window expiration

    // Make 3 requests to reach the limit
    for (let i = 0; i < 3; i++) {
      await request(app).get('/');
    }

    // Wait for the rate limit window to expire
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Request after window expiration should pass
    request(app).get('/').expect('Hello, world!').expect(200);
  });
});
