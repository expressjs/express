
app.redirect('user list', '/users');

app.get('/users', function(req, res){
  res.render('user/list', { users: db.users });
});

app.get('/user/add', function(req, res){
  res.render('user/add');
});

app.post('/user', function(req, res){
  var user = req.body.user;
  db.users.push(user);
  res.redirect('user list');
});

app.get('/user/:id', function(req, res){
  res.render('user');
});