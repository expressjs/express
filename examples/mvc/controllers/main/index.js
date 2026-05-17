const request = require('supertest');
const express = require('express');
const mainController = require('../../examples/mvc/controllers/main/index');

describe('main controller - index', () => {
  let app;

  beforeEach(() => {
    app = express();
    // Mock route that uses the controller
    app.get('/', mainController.index);
  });

  test('should redirect to /users with status 302', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/users');
  });

  test('should call res.redirect exactly once', async () => {
    // Spy on res.redirect by creating a custom middleware
    const redirectSpy = jest.fn();
    const mockRes = {
      redirect: redirectSpy,
    };
    const mockReq = {};
    await new Promise((resolve) => {
      mainController.index(mockReq, mockRes);
      resolve();
    });
    expect(redirectSpy).toHaveBeenCalledTimes(1);
    expect(redirectSpy).toHaveBeenCalledWith('/users');
  });
});
