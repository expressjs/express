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
    // routes for each content type
    app.get('/html', usersHandler.html);
    app.get('/text', usersHandler.text);
    app.get('/json', usersHandler.json);
  });

  test('html handler returns an unordered list with user names', async () => {
    const response = await request(app).get('/html');
    expect(response.status).toBe(200);
    expect(response.text).toBe('<ul><li>Alice</li><li>Bob</li></ul>');
    expect(response.headers['content-type']).toMatch(/html/);
  });

  test('text handler returns each user name prefixed with a dash and newline', async () => {
    const response = await request(app).get('/text');
    expect(response.status).toBe(200);
    expect(response.text).toBe(' - Alice\n - Bob\n');
    expect(response.headers['content-type']).toMatch(/plain/);
  });

  test('json handler returns the users array as JSON', async () => {
    const response = await request(app).get('/json');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { name: 'Alice' },
      { name: 'Bob' },
    ]);
    expect(response.headers['content-type']).toMatch(/json/);
  });

  test('handlers work with empty user list', async () => {
    jest.doMock('../examples/content-negotiation/db', () => []);
    const reloaded = require('../examples/content-negotiation/users');
    const emptyApp = express();
    emptyApp.get('/html', reloaded.html);
    emptyApp.get('/text', reloaded.text);
    emptyApp.get('/json', reloaded.json);

    const htmlRes = await request(emptyApp).get('/html');
    expect(htmlRes.text).toBe('<ul></ul>');

    const textRes = await request(emptyApp).get('/text');
    expect(textRes.text).toBe('');

    const jsonRes = await request(emptyApp).get('/json');
    expect(jsonRes.body).toEqual([]);
  });
});