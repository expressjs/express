const path = require('path');
const controller = require(path.resolve(__dirname, '../../examples/mvc/controllers/main/index.js'));

describe('main controller', () => {
  test('index redirects to /users', () => {
    const req = {};
    const res = { redirect: jest.fn() };
    controller.index(req, res);
    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('/users');
  });
});