/* Add the missing import in the route definition file, e.g., routes/users.js */
const usersHandlers = require('../examples/content-negotiation/users');
app.get('/users.html', usersHandlers.html);
app.get('/users.txt', usersHandlers.text);
app.get('/users.json', usersHandlers.json);