const path = require('path');
const users = require(path.join(__dirname, '../../examples/content-negotiation/db'));
const handlers = require(path.join(__dirname, '../../examples/content-negotiation/users'));

describe('users handlers', () => {
  const mockRes = () => {
    const res = {};
    res.send = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('html handler returns an unordered list with each user name', () => {
    const req = {};
    const res = mockRes();
    handlers.html(req, res);
    const expectedHtml = '<ul>' + users.map(u => `<li>${u.name}</li>`).join('') + '</ul>';
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(expectedHtml);
  });

  test('text handler returns each user name prefixed with a dash and newline', () => {
    const req = {};
    const res = mockRes();
    handlers.text(req, res);
    const expectedText = users.map(u => ` - ${u.name}\n`).join('');
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(expectedText);
  });

  test('json handler returns the raw users array via res.json', () => {
    const req = {};
    const res = mockRes();
    handlers.json(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(users);
  });

  test('html handler works with empty users array', () => {
    const originalUsers = [...users];
    try {
      // temporarily replace the module's users reference
      jest.resetModules();
      jest.doMock(path.join(__dirname, '../../examples/content-negotiation/db'), () => []);
      const emptyHandlers = require(path.join(__dirname, '../../examples/content-negotiation/users'));
      const res = mockRes();
      emptyHandlers.html({}, res);
      expect(res.send).toHaveBeenCalledWith('<ul></ul>');
    } finally {
      // restore original module cache
      jest.resetModules();
      jest.doMock(path.join(__dirname, '../../examples/content-negotiation/db'), () => originalUsers);
    }
  });
});