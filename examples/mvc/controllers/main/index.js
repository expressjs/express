const path = require('path');
const controllerPath = path.resolve(__dirname, '../../examples/mvc/controllers/main/index.js');
const mainController = require(controllerPath);

describe('examples/mvc/controllers/main/index.js', () => {
  test('index redirects to /users', () => {
    const req = {};
    const res = { redirect: jest.fn() };
    mainController.index(req, res);
    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('/users');
  });

  test('index does not modify request object', () => {
    const req = { foo: 'bar' };
    const res = { redirect: jest.fn() };
    const originalReq = { ...req };
    mainController.index(req, res);
    expect(req).toEqual(originalReq);
  });

  test('index handles missing res.redirect gracefully (throws)', () => {
    const req = {};
    const res = {};
    expect(() => mainController.index(req, res)).toThrow();
  });
});