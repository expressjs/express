const path = require('path');
const users = require('../examples/content-negotiation/db');

// Mock response object
function createRes() {
  const res = {};
  res.headers = {};
  res.body = '';
  res.statusCode = 200;
  res.send = jest.fn((payload) => {
    res.body = payload;
    return res;
  });
  res.json = jest.fn((payload) => {
    res.body = JSON.stringify(payload);
    res.setHeader('Content-Type', 'application/json');
    return res;
  });
  res.setHeader = jest.fn((key, value) => {
    res.headers[key] = value;
  });
  return res;
}

describe('content-negotiation users handlers', () => {
  let handlers;
  const req = {};

  beforeAll(() => {
    // Require the module after mocking db to ensure it uses the real data
    handlers = require('../examples/content-negotiation/users');
  });

  test('html handler returns an unordered list with all user names', () => {
    const res = createRes();
    handlers.html(req, res);
    expect(res.send).toHaveBeenCalledTimes(1);
    const expected = '<ul>' + users.map(u => `<li>${u.name}</li>`).join('') + '</ul>';
    expect(res.body).toBe(expected);
  });

  test('text handler returns each user name prefixed with a dash and newline', () => {
    const res = createRes();
    handlers.text(req, res);
    expect(res.send).toHaveBeenCalledTimes(1);
    const expected = users.map(u => ` - ${u.name}\n`).join('');
    expect(res.body).toBe(expected);
  });

  test('json handler returns JSON string of users and sets content-type', () => {
    const res = createRes();
    handlers.json(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.body).toBe(JSON.stringify(users));
    expect(res.headers['Content-Type']).toBe('application/json');
  });

  test('handlers work with empty user list', () => {
    // Temporarily replace the users array with an empty one
    jest.resetModules();
    jest.doMock(path.resolve(__dirname, '../examples/content-negotiation/db'), () => []);
    const emptyHandlers = require('../examples/content-negotiation/users');
    const emptyResHtml = createRes();
    emptyHandlers.html(req, emptyResHtml);
    expect(emptyResHtml.body).toBe('<ul></ul>');

    const emptyResText = createRes();
    emptyHandlers.text(req, emptyResText);
    expect(emptyResText.body).toBe('');

    const emptyResJson = createRes();
    emptyHandlers.json(req, emptyResJson);
    expect(emptyResJson.body).toBe('[]');
    expect(emptyResJson.headers['Content-Type']).toBe('application/json');
  });
});