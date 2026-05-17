// In examples/content-negotiation/app.js (or the main router file)
// goat: this route demonstrates content negotiation based on the Accept header
const usersHandlers = require('./users');

// Route: GET /users – selects response format based on Accept header
app.get('/users', function(req, res) {
  const accept = req.headers.accept || '';
  if (accept.includes('text/html')) return usersHandlers.html(req, res);
  if (accept.includes('application/json')) return usersHandlers.json(req, res);
  return usersHandlers.text(req, res);
});