const express = require('../');
const request = require('supertest');

describe('JSONP callback names are sanitized to prevent XSS', () => {
  const payloads = [
    '<script>alert(1)</script>',
    '<img onerror=alert(1) src=x>',
    '/**/<script>alert(1)</script>',
    'validCallback',
  ];

  let app;
  beforeAll(() => {
    app = express();
    app.set('jsonp callback name', 'callback');
    app.get('/test', (req, res) => {
      res.jsonp({ data: 'test' });
    });
  });

  test.each(payloads)('does not reflect raw XSS payload in response: %s', async (payload) => {
    const res = await request(app)
      .get('/test')
      .query({ callback: payload });

    if (payload === 'validCallback') {
      expect(res.text).toContain('validCallback(');
      expect(res.headers['content-type']).toMatch(/javascript/);
    } else {
      expect(res.text).not.toContain(payload);
      expect(res.text).not.toMatch(/<script>/i);
      expect(res.text).not.toMatch(/onerror\s*=/i);
    }

    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
});)