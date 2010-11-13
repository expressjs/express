
// Fake posts database

var posts = [
      { title: 'Foo', body: 'some foo bar' }
    , { title: 'Foo bar', body: 'more foo bar' }
    , { title: 'Foo bar baz', body: 'more foo bar baz' }
  ];

exports.list = function(req, res){
  res.render('post/list', {
    locals: {
        title: 'Posts'
      , posts: posts
    }
  });
};
