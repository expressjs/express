const request = require('supertest');
const express = require('express');
const usersHandler = require('../examples/content-negotiation/users');

// Mock the users database
jest.mock('../examples/content-negotiation/db', () => [
  { name: 'Alice' },
  { name: 'Bob' },
]);

describe('users handlers', () => {
  let app;

  beforeEach(() => {
    app = express();
    // Routes for each format
    app.get('/html', usersHandler.html);
    app.get('/text', usersHandler.text);
    app.get('/json', usersHandler.json);
  });

  test('html handler returns an unordered list with user names', async () => {
    const response = await request(app).get('/html');
    expect(response.status).toBe(200);
    expect(response.type).toMatch(/html/);
    // Expected HTML string
    const expectedHtml = '<ul><li>Alice</li><li>Bob</li></ul>';
    expect(response.text).toBe(expectedHtml);
  });

  test('text handler returns plain text list of user names', async () => {
    const response = await request(app).get('/text');
    expect(response.status).toBe(200);
    expect(response.type).toMatch(/plain/);
    const expectedText = ' - Alice\n - Bob\n';
    expect(response.text).toBe(expectedText);
  });

  test('json handler returns JSON array of users', async () => {
    const response = await request(app).get('/json');
    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual([
      { name: 'Alice' },
      { name: 'Bob' },
    ]);
  });

  test('html handler works with empty users array', async () => {
    jest.resetModules();
    jest.doMock('../examples/content-negotiation/db', () => []);
    const emptyHandler = require('../examples/content-negotiation/users');
    const emptyApp = express();
    emptyApp.get('/html', emptyHandler.html);
    const response = await request(emptyApp).get('/html');
    expect(response.status).toBe(200);
    expect(response.text).toBe('<ul></ul>');
  });
});