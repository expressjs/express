const path = require('path');
const users = require(path.join(__dirname, '../../examples/content-negotiation/db'));
const handlers = require(path.join(__dirname, '../../examples/content-negotiation/users'));

describe('users handlers', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      send: jest.fn(),
      json: jest.fn()
    };
  });

  test('html handler returns an unordered list with each user name', () => {
    handlers.html(req, res);
    const expectedHtml = '<ul>' + users.map(u => `<li>${u.name}</li>`).join('') + '</ul>';
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(expectedHtml);
  });

  test('text handler returns each user name prefixed with a dash and newline', () => {
    handlers.text(req, res);
    const expectedText = users.map(u => ` - ${u.name}\n`).join('');
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(expectedText);
  });

  test('json handler returns the raw users array via res.json', () => {
    handlers.json(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(users);
  });

  test('html handler works with empty users array', () => {
    const original = users.slice();
    try {
      // temporarily replace the module's internal users reference
      jest.resetModules();
      jest.doMock(path.join(__dirname, '../../examples/content-negotiation/db'), () => []);
      const emptyHandlers = require(path.join(__dirname, '../../examples/content-negotiation/users'));
      emptyHandlers.html(req, res);
      expect(res.send).toHaveBeenCalledWith('<ul></ul>');
    } finally {
      // restore original module cache
      jest.resetModules();
      jest.doMock(path.join(__dirname, '../../examples/content-negotiation/db'), () => original);
    }
  });
});