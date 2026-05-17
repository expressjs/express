const usersController = require('./users');
app.get('/users', function(req, res) {
  const accept = req.headers.accept || '';
  if (accept.includes('text/html')) return usersController.html(req, res);
  if (accept.includes('application/json')) return usersController.json(req, res);
  return usersController.text(req, res);
});