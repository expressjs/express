const httpMocks = require('node-mocks-http');
const controller = require('../../examples/mvc/controllers/main/index');

describe('main controller - index', () => {
  test('should redirect to /users', () => {
    const req = httpMocks.createRequest({ method: 'GET', url: '/' });
    const res = httpMocks.createResponse();
    // Spy on redirect
    const redirectSpy = jest.spyOn(res, 'redirect');

    controller.index(req, res);

    expect(redirectSpy).toHaveBeenCalledTimes(1);
    expect(redirectSpy).toHaveBeenCalledWith('/users');
  });

  test('should still redirect even if request object is missing properties', () => {
    const req = {};
    const res = httpMocks.createResponse();
    const redirectSpy = jest.spyOn(res, 'redirect');

    controller.index(req, res);

    expect(redirectSpy).toHaveBeenCalledWith('/users');
  });

  test('should not throw when response object lacks redirect method', () => {
    const req = httpMocks.createRequest();
    const res = {};
    expect(() => controller.index(req, res)).not.toThrow();
  });
});