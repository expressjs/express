
exports.index = function(req, res){
  res.render('index', {
    locals: {
      title: 'Route Separation Example'
    }
  });
};