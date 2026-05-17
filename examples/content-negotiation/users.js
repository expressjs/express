// __tests__/users.test.js
const httpMocks = require('node-mocks-http');
const path = require('path');

// Mock the ./db module to control the users data
jest.mock(path.join(__dirname, '..', 'examples', 'content-negotiation', 'db'), () => [
  { name: 'Alice' },
  { name: 'Bob' }
]);

const usersController = require(path.join('..', 'examples', 'content-negotiation', 'users'));

describe('users controller', () => {
  describe('html', () => {
    it('should return an unordered list with each user name as a list item', () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      usersController.html(req, res);

      const data = res._getData();
      expect(res._isEndCalled()).toBe(true);
      expect(data).toBe('<ul><li>Alice</li><li>Bob</li></ul>');
    });
  });

  describe('text', () => {
    it('should return each user name prefixed with a dash and newline separated', () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      usersController.text(req, res);

      const data = res._getData();
      expect(res._isEndCalled()).toBe(true);
      expect(data).toBe(' - Alice\n - Bob\n');
    });
  });

  describe('json', () => {
    it('should respond with JSON representation of the users array', () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });

      // Spy on json method
      const jsonSpy = jest.spyOn(res, 'json');

      usersController.json(req, res);

      expect(jsonSpy).toHaveBeenCalledWith([
        { name: 'Alice' },
        { name: 'Bob' }
      ]);
    });
  });

  // Edge case: empty users array
  describe('edge cases', () => {
    beforeAll(() => {
      jest.resetModules();
      jest.doMock(path.join(__dirname, '..', 'examples', 'content-negotiation', 'db'), () => []);
    });

    const emptyController = require(path.join('..', 'examples', 'content-negotiation', 'users'));

    it('html with empty users should return empty list tags', () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      emptyController.html(req, res);
      expect(res._getData()).toBe('<ul></ul>');
    });

    it('text with empty users should return empty string', () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      emptyController.text(req, res);
      expect(res._getData()).toBe('');
    });

    it('json with empty users should return empty array', () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });
      const jsonSpy = jest.spyOn(res, 'json');
      emptyController.json(req, res);
      expect(jsonSpy).toHaveBeenCalledWith([]);
    });
  });
});
