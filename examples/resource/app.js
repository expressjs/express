
/**
 * Module dependencies.
 */

var express = require('../../lib/express');

var app = express.createServer();

// Ad-hoc example resource method

app.resource = function(path, obj) {
    this.get(path, obj.index);
    this.get(path + '/:id', obj.show);
    this.del(path + '/:id', obj.destroy);
};

// Fake records

var users = [
    { name: 'tj' },
    { name: 'ciaran' },
    { name: 'aaron' }
];

// Fake model

var User = {
    index: function(req, res){
        res.send(users);
    },
    show: function(req, res, params){
        res.send(users[params.id] || { error: 'Cannot find user' });
    },
    destroy: function(req, res, params){
        var destroyed = params.id in users;
        delete users[params.id];
        res.send(destroyed ? 'destroyed' : 'Cannot find user');
    }
};

// curl http://localhost:3000/users     -- responds with all users
// curl http://localhost:3000/users/1   -- responds with user 1
// curl http://localhost:3000/users/4   -- responds with error
// curl -X DELETE http://localhost:3000/users/1  -- deletes the user

app.resource('/users', User);

app.listen(3000);