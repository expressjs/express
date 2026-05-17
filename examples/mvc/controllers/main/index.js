const path = require('path');
const controllerPath = path.resolve(__dirname, '../../examples/mvc/controllers/main/index.js');
const mainController = require(controllerPath);

describe('examples/mvc/controllers/main/index.js', () => {
  test('index redirects to /users with status 302 by default', () => {
    const req = {};
    const res = {
      redirect: jest.fn()
    };
    mainController.index(req, res);
    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('/users');
  });

  test('index still calls redirect even if extra properties are present on req/res', () => {
    const req = { foo: 'bar' };
    const res = {
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    mainController.index(req, res);
    expect(res.redirect).toHaveBeenCalledWith('/users');
  });

  test('throws when res.redirect is not a function', () => {
    const req = {};
    const res = { redirect: null };
    expect(() => mainController.index(req, res)).toThrow();
  });

  test('throws when res is undefined', () => {
    const req = {};
    expect(() => mainController.index(req, undefined)).toThrow();
  });
});