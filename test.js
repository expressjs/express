
var express = require('./');
var app = express();

app.use(express.logger('dev'));
app.use(express.bodyParser());

app.post('/', function(req, res){
  res.send('done\n');
});

app.listen(3000);
console.log('listening on port 3000');