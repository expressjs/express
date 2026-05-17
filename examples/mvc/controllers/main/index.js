const path = require('path');
const request = require('supertest');
const express = require('express');

// Import the controller
const mainController = require(path.resolve(__dirname, '../../examples/mvc/controllers/main/index.js'));

describe('examples/mvc/controllers/main/index.js', () => {
  let app;

  beforeEach(() => {
    app = express();
    // Define a route that uses the controller
    app.get('/', mainController.index);
  });

  test('should redirect to /users with status 302 by default', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/users');
  });

  test('should still redirect correctly when request object has extra properties', async () => {
    // Simulate a request with additional query params or headers
    const response = await request(app).get('/?foo=bar').set('X-Custom-Header', 'test');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/users');
  });

  test('should not throw even if res.redirect is mocked differently', async () => {
    const mockRes = {
      redirect: jest.fn()
    };
    // Call the controller directly with mock objects
    mainController.index({} , mockRes);
    expect(mockRes.redirect).toHaveBeenCalledTimes(1);
    expect(mockRes.redirect).toHaveBeenCalledWith('/users');
  });
});