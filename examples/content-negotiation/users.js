const path = require('path');
const usersModule = require(path.join(__dirname, '../../examples/content-negotiation/users.js'));

// Mock the users data used by the module
jest.mock(path.join(__dirname, '../../examples/content-negotiation/db'), () => [
  { name: 'Alice' },
  { name: 'Bob' },
  { name: 'Charlie' }
]);

describe('users handlers', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      send: jest.fn(),
      json: jest.fn()
    };
  });

  test('html handler returns an unordered list of user names', () => {
    usersModule.html(req, res);
    const expectedHtml = '<ul>' +
      '<li>Alice</li>' +
      '<li>Bob</li>' +
      '<li>Charlie</li>' +
      '</ul>';
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(expectedHtml);
  });

  test('text handler returns each user name prefixed with a dash and newline', () => {
    usersModule.text(req, res);
    const expectedText = ' - Alice\n - Bob\n - Charlie\n';
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(expectedText);
  });

  test('json handler returns the raw users array', () => {
    usersModule.json(req, res);
    const expectedArray = [
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' }
    ];
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(expectedArray);
  });

  test('html handler works with empty users array', () => {
    jest.resetModules();
    jest.doMock(path.join(__dirname, '../../examples/content-negotiation/db'), () => []);
    const emptyModule = require(path.join(__dirname, '../../examples/content-negotiation/users.js'));
    emptyModule.html(req, res);
    expect(res.send).toHaveBeenCalledWith('<ul></ul>');
  });

  test('text handler works with empty users array', () => {
    jest.resetModules();
    jest.doMock(path.join(__dirname, '../../examples/content-negotiation/db'), () => []);
    const emptyModule = require(path.join(__dirname, '../../examples/content-negotiation/users.js'));
    emptyModule.text(req, res);
    expect(res.send).toHaveBeenCalledWith('');
  });
});