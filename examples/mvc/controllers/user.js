
// Fake user database for example

var users = [
    { name: 'TJ', email: 'tj@vision-media.ca' },
    { name: 'Simon', email: 'simon@vision-media.ca' }
];

module.exports = {
    
    // /users
    
    index: function(req, res){
        res.render(users);
    },

    // /users/:id

    show: function(req, res, next){
        var id = req.params.id,
            user = users[id];
        if (user) {
            res.render(user);
        } else {
            next(new Error('User ' + id + ' does not exist'));
        }
    }
};