
var express = require('../../')
  , app = module.exports = express()
  , users = require('./db');

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
// this to abstract make things a bit more declarative:

function format(mod) {
  var obj = require(mod);
  return function(req, res){
    res.format(obj);
  }
}

app.get('/users', format('./users'));

if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000');
}