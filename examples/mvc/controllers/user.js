
// Fake user database for example

var users = [
    { id: 0, name: 'TJ', email: 'tj@vision-media.ca' },
    { id: 1, name: 'Simon', email: 'simon@vision-media.ca' }
];

function get(id, fn) {
    if (users[id]) {
        fn(null, users[id]);
    } else {
        fn(new Error('User ' + id + ' does not exist'));
    }
}

module.exports = {
    
    // /users
    
    index: function(req, res){
        res.render(users);
    },

    // /users/:id

    show: function(req, res, next){
        get(req.params.id, function(err, user){
            if (err) return next(err);
            res.render(user);
        });
    },
    
    // /users/:id/edit
    
    edit: function(req, res, next){
        get(req.params.id, function(err, user){
            if (err) return next(err);
            res.render(user);
        });
    },
    
    // PUT /users/:id
    
    update: function(req, res, next){
        var id = req.params.id;
        get(id, function(err){
            if (err) return next(err);
            var user = users[id] = req.body.user;
            user.id = id;
            req.flash('info', 'Successfully updated _' + user.name + '_.');
            res.redirect('back');
        });
    }
};