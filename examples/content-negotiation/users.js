const path = require('path');
const users = require(path.join(__dirname, '..', 'examples', 'content-negotiation', 'db'));

// Mock response object
function createRes() {
  return {
    sendCalledWith: null,
    jsonCalledWith: null,
    send(payload) { this.sendCalledWith = payload; },
    json(payload) { this.jsonCalledWith = payload; }
  };
}

describe('content-negotiation handlers', () => {
  const handlers = require(path.join(__dirname, '..', 'examples', 'content-negotiation', 'users'));

  test('html handler returns an unordered list of user names', () => {
    const res = createRes();
    handlers.html({}, res);
    const expected = '<ul>' + users.map(u => `<li>${u.name}</li>`).join('') + '</ul>';
    expect(res.sendCalledWith).toBe(expected);
  });

  test('text handler returns each user name prefixed with a dash and newline', () => {
    const res = createRes();
    handlers.text({}, res);
    const expected = users.map(u => ` - ${u.name}\n`).join('');
    expect(res.sendCalledWith).toBe(expected);
  });

  test('json handler returns the raw users array', () => {
    const res = createRes();
    handlers.json({}, res);
    expect(res.jsonCalledWith).toBe(users);
  });

  test('html handler works with empty user list', () => {
    const original = require.cache[require.resolve(path.join(__dirname, '..', 'examples', 'content-negotiation', 'db'))];
    jest.resetModules();
    jest.doMock(path.join('..', 'examples', 'content-negotiation', 'db'), () => []);
    const emptyHandlers = require(path.join(__dirname, '..', 'examples', 'content-negotiation', 'users'));
    const res = createRes();
    emptyHandlers.html({}, res);
    expect(res.sendCalledWith).toBe('<ul></ul>');
    // restore original module
    jest.dontMock(path.join('..', 'examples', 'content-negotiation', 'db'));
    jest.resetModules();
    require.cache[require.resolve(path.join(__dirname, '..', 'examples', 'content-negotiation', 'db'))] = original;
  });
});