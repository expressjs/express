// hello: register users route with content negotiation
const usersHandlers = require('./users');
app.get('/users', function(req, res) {
  const accept = req.headers.accept || '';
  if (accept.includes('text/html')) return usersHandlers.html(req, res);
  if (accept.includes('application/json')) return usersHandlers.json(req, res);
  return usersHandlers.text(req, res);
});