const path = require('path');
const users = require(path.join(__dirname, '../../examples/content-negotiation/db'));

// Mock response object
function createRes() {
  return {
    send: jest.fn(),
    json: jest.fn()
  };
}

describe('content-negotiation users handlers', () => {
  const handlers = require(path.join(__dirname, '../../examples/content-negotiation/users'));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('html handler returns unordered list with user names', () => {
    const req = {};
    const res = createRes();
    handlers.html(req, res);
    const expected = '<ul>' + users.map(u => `<li>${u.name}</li>`).join('') + '</ul>';
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(expected);
  });

  test('text handler returns bullet list with newline separators', () => {
    const req = {};
    const res = createRes();
    handlers.text(req, res);
    const expected = users.map(u => ` - ${u.name}\n`).join('');
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(expected);
  });

  test('json handler returns the raw users array', () => {
    const req = {};
    const res = createRes();
    handlers.json(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(users);
  });

  test('html handler works with empty users array', () => {
    const original = users.slice();
    try {
      // temporarily replace users with empty array
      jest.resetModules();
      jest.doMock(path.join(__dirname, '../../examples/content-negotiation/db'), () => []);
      const emptyHandlers = require(path.join(__dirname, '../../examples/content-negotiation/users'));
      const res = createRes();
      emptyHandlers.html({}, res);
      expect(res.send).toHaveBeenCalledWith('<ul></ul>');
    } finally {
      // restore original module cache
      jest.resetModules();
      jest.doMock(path.join(__dirname, '../../examples/content-negotiation/db'), () => original);
    }
  });
});