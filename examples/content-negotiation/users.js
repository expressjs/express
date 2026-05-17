// In the route definition where content negotiation is set up, e.g., routes/index.js
const usersHandlers = require('../examples/content-negotiation/users');
app.get('/users', (req, res) => {
  const accept = req.headers.accept || '';
  if (accept.includes('text/html')) return usersHandlers.html(req, res);
  if (accept.includes('application/json')) return usersHandlers.json(req, res);
  return usersHandlers.text(req, res);
});