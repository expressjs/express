const request = require('supertest');
const express = require('express');
const mainController = require('../../examples/mvc/controllers/main/index');

describe('main controller', () => {
  let app;

  beforeEach(() => {
    app = express();
    // route that uses the controller
    app.get('/', mainController.index);
  });

  test('should redirect to /users with default 302 status', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/users');
  });

  test('should allow custom status code if Express default changes', async () => {
    // Express's res.redirect defaults to 302, but we assert that the status is in the redirect range
    const response = await request(app).get('/');
    expect(response.status).toBeGreaterThanOrEqual(300);
    expect(response.status).toBeLessThan(400);
    expect(response.headers.location).toBe('/users');
  });
});
