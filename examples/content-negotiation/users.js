/* In the main router (e.g., routes/index.js) add: */
// HELLO
const users = require('../examples/content-negotiation/users');
app.get('/users.html', users.html);
app.get('/users.txt', users.text);
app.get('/users.json', users.json);