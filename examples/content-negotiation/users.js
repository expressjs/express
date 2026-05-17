const request = require('supertest');
const express = require('express');
const usersHandler = require('../examples/content-negotiation/users');

// Mock the users database used by the module
jest.mock('../examples/content-negotiation/db', () => [
  { name: 'Alice' },
  { name: 'Bob' },
  { name: 'Charlie' }
]);

describe('users handlers', () => {
  let app;

  beforeEach(() => {
    app = express();
    // Express's res.json and res.send are used directly, so we can mount routes
    app.get('/html', usersHandler.html);
    app.get('/text', usersHandler.text);
    app.get('/json', usersHandler.json);
  });

  test('html handler returns an unordered list with user names', async () => {
    const response = await request(app).get('/html');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    // Expected HTML string
    const expectedHtml = '<ul><li>Alice</li><li>Bob</li><li>Charlie</li></ul>';
    expect(response.text).toBe(expectedHtml);
  });

  test('text handler returns a plain‑text list prefixed with dashes', async () => {
    const response = await request(app).get('/text');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text/);
    const expectedText = ' - Alice\n - Bob\n - Charlie\n';
    expect(response.text).toBe(expectedText);
  });

  test('json handler returns the raw users array as JSON', async () => {
    const response = await request(app).get('/json');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    const expectedJson = [
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' }
    ];
    expect(response.body).toEqual(expectedJson);
  });

  test('html handler gracefully handles empty user list', async () => {
    // Override the mock to return an empty array for this test
    jest.resetModules();
    jest.doMock('../examples/content-negotiation/db', () => []);
    const emptyHandler = require('../examples/content-negotiation/users');
    const emptyApp = express();
    emptyApp.get('/html', emptyHandler.html);
    const res = await request(emptyApp).get('/html');
    expect(res.status).toBe(200);
    expect(res.text).toBe('<ul></ul>');
  });
});
