const path = require('path');
const controller = require(path.resolve(__dirname, '../../examples/mvc/controllers/main/index.js'));

describe('main controller - index', () => {
  test('should redirect to /users', () => {
    const req = {};
    const res = {
      redirect: jest.fn()
    };
    controller.index(req, res);
    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('/users');
  });

  test('should still call redirect even if res has extra properties', () => {
    const req = {};
    const res = {
      status: 200,
      headersSent: false,
      redirect: jest.fn()
    };
    controller.index(req, res);
    expect(res.redirect).toHaveBeenCalledWith('/users');
  });

  test('should not throw when res.redirect is not a function', () => {
    const req = {};
    const res = {};
    expect(() => controller.index(req, res)).not.toThrow();
  });
});