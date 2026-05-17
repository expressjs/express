const request = require('supertest');
const express = require('express');
const mainController = require('../../examples/mvc/controllers/main/index');

describe('mainController.index', () => {
  let app;
  beforeEach(() => {
    app = express();
    // Mock route to use the controller
    app.get('/', mainController.index);
  });

  test('should redirect to /users', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/users');
  });

  test('should still redirect when request object is empty', async () => {
    // Directly invoke the handler with minimal mocks
    const req = {};
    const res = { redirect: jest.fn() };
    mainController.index(req, res);
    expect(res.redirect).toHaveBeenCalledWith('/users');
  });

  test('should handle a response object that throws', () => {
    const req = {};
    const res = { redirect: () => { throw new Error('redirect failed'); } };
    expect(() => mainController.index(req, res)).toThrow('redirect failed');
  });
});