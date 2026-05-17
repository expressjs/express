// In the main router (e.g., routes/index.js or server.js) add:
const usersController = require('../examples/content-negotiation/users');

app.get('/users.html', usersController.html);
app.get('/users.txt', usersController.text);
app.get('/users.json', usersController.json);