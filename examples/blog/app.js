
var app = require('./main');

app.use('/blog', require('./blog'));

app.listen(3000);