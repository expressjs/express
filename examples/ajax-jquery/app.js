var express = require('../../lib/express'),
    app = express(),
    bodyParser = require('body-parser');

app.set('view engine', 'jade');
app.set('views', __dirname+'/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('ajax');
});

app.post('/for-ajax', function(req, res) {

  var returnData = {
    result: req.body.boxText
  };

  res.send(returnData);
  console.log('Ajax reqwest: ' + JSON.stringify(req.body));
})

app.get('*', function(req, res) {
  res.send('error404')
});

app.listen(process.env.VCAP_APP_PORT || 3000, function() {
  console.log(new Date()+' NodeJS is runing');
});
