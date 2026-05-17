const request = require('supertest');
const express = require('express');
const mainController = require('../../examples/mvc/controllers/main/index');

describe('main controller', () => {
  let app;
  beforeEach(() => {
    app = express();
    app.get('/', mainController.index);
  });

  test('should redirect to /users', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/users');
  });

  test('should still redirect when request object is missing properties', async () => {
    // Simulate a minimal req object by calling the handler directly
    const req = {};
    const res = {
      redirect: jest.fn()
    };
    await mainController.index(req, res);
    expect(res.redirect).toHaveBeenCalledWith('/users');
  });

  test('should handle errors thrown by res.redirect gracefully', async () => {
    const req = {};
    const error = new Error('redirect failed');
    const res = {
      redirect: jest.fn(() => { throw error; })
    };
    expect(() => mainController.index(req, res)).toThrow('redirect failed');
  });
});