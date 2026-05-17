const httpMocks = require('node-mocks-http');

describe('examples/mvc/controllers/main/index.js', () => {
  let controller;

  beforeAll(() => {
    controller = require('../../examples/mvc/controllers/main/index');
  });

  test('should redirect to /users with status 302', () => {
    const req = httpMocks.createRequest({ method: 'GET', url: '/' });
    const res = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });

    controller.index(req, res);

    // node-mocks-http does not automatically end the response, so we manually check
    expect(res._getStatusCode()).toBe(302);
    expect(res._getRedirectUrl()).toBe('/users');
  });

  test('should set Location header to /users', () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    controller.index(req, res);

    expect(res.getHeader('Location')).toBe('/users');
  });

  test('should not modify request object', () => {
    const req = httpMocks.createRequest({ method: 'GET', url: '/original' });
    const originalUrl = req.url;
    const res = httpMocks.createResponse();

    controller.index(req, res);

    expect(req.url).toBe(originalUrl);
  });
});