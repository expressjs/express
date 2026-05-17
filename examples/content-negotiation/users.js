const path = require('path');
const usersData = require(path.join(__dirname, '../../examples/content-negotiation/db'));

// Mock response object
function createRes() {
  return {
    _status: null,
    _body: null,
    status(code) { this._status = code; return this; },
    send(body) { this._body = body; return this; },
    json(obj) { this._body = JSON.stringify(obj); return this; },
  };
}

describe('content-negotiation users handlers', () => {
  const handlers = require(path.join(__dirname, '../../examples/content-negotiation/users'));

  beforeEach(() => {
    // Ensure the original users array is restored before each test
    jest.resetModules();
  });

  test('html handler returns unordered list of user names', () => {
    const req = {};
    const res = createRes();
    handlers.html(req, res);
    const expected = '<ul>' + usersData.map(u => `<li>${u.name}</li>`).join('') + '</ul>';
    expect(res._body).toBe(expected);
  });

  test('text handler returns bullet list of user names', () => {
    const req = {};
    const res = createRes();
    handlers.text(req, res);
    const expected = usersData.map(u => ` - ${u.name}\n`).join('');
    expect(res._body).toBe(expected);
  });

  test('json handler returns JSON string of users array', () => {
    const req = {};
    const res = createRes();
    handlers.json(req, res);
    expect(res._body).toBe(JSON.stringify(usersData));
  });

  describe('edge cases with empty users array', () => {
    let emptyHandlers;
    beforeAll(() => {
      jest.doMock(path.join(__dirname, '../../examples/content-negotiation/db'), () => []);
      emptyHandlers = require(path.join(__dirname, '../../examples/content-negotiation/users'));
    });
    afterAll(() => {
      jest.dontMock(path.join(__dirname, '../../examples/content-negotiation/db'));
    });

    test('html handler returns empty ul when no users', () => {
      const res = createRes();
      emptyHandlers.html({}, res);
      expect(res._body).toBe('<ul></ul>');
    });

    test('text handler returns empty string when no users', () => {
      const res = createRes();
      emptyHandlers.text({}, res);
      expect(res._body).toBe('');
    });

    test('json handler returns empty array JSON when no users', () => {
      const res = createRes();
      emptyHandlers.json({}, res);
      expect(res._body).toBe('[]');
    });
  });
});