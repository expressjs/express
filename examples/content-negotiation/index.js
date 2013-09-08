var express = require('../../')
  , app = module.exports = express()
  , users = require('./db');

// so either you can deal with different types of formatting 
// for expected response in index.js
app.get('/', function(req, res){
  res.format({
    html: function(){
      res.send('<ul>' + users.map(function(user){
        return '<li>' + user.name + '</li>';
      }).join('') + '</ul>');
    },

    text: function(){
      res.send(users.map(function(user){
        return ' - ' + user.name + '\n';
      }).join(''));
    },

    json: function(){
      res.json(users);
    }
  })
});

// or you could write a tiny middleware like
// this to add a layer of abstraction
// and make things a bit more declarative:

function format(requestHandlerName) {
  var requestHandler = require(requestHandlerName);
  return function(req, res){
    res.format(requestHandler);
  }
}

app.get('/users', format('./users'));

if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000');
}
