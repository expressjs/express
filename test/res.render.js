
var express = require('../')
  , request = require('supertest');

describe('res', function(){
  describe('.render(name)', function(){
    it('should support absolute paths', function(done){
      var app = express();

      app.locals.user = { name: 'tobi' };

      app.use(function(req, res){
        res.render(__dirname + '/fixtures/user.jade');
      });

      request(app)
      .get('/')
      .expect('<p>tobi</p>', done);
    })

    it('should support absolute paths with "view engine"', function(done){
      var app = express();

      app.locals.user = { name: 'tobi' };
      app.set('view engine', 'jade');

      app.use(function(req, res){
        res.render(__dirname + '/fixtures/user');
      });

      request(app)
      .get('/')
      .expect('<p>tobi</p>', done);
    })

    it('should expose app.locals', function(done){
      var app = express();

      app.set('views', __dirname + '/fixtures');
      app.locals.user = { name: 'tobi' };

      app.use(function(req, res){
        res.render('user.jade');
      });

      request(app)
      .get('/')
      .expect('<p>tobi</p>', done);
    })
  
    it('should support index.<engine>', function(done){
      var app = express();

      app.set('views', __dirname + '/fixtures');
      app.set('view engine', 'jade');

      app.use(function(req, res){
        res.render('blog/post');
      });

      request(app)
      .get('/')
      .expect('<h1>blog post</h1>', done);
    })

    describe('when an error occurs', function(){
      it('should next(err)', function(done){
        var app = express();

        app.set('views', __dirname + '/fixtures');

        app.use(function(req, res){
          res.render('user.jade');
        });

        app.use(function(err, req, res, next){
          res.end(err.message);
        });

        request(app)
        .get('/')
        .expect(/Cannot read property 'name' of undefined/, done);
      })
    })

    describe('when "view engine" is given', function(){
      it('should render the template', function(done){
        var app = express();

        app.set('view engine', 'jade');
        app.set('views', __dirname + '/fixtures');

        app.use(function(req, res){
          res.render('email');
        });

        request(app)
        .get('/')
        .expect('<p>This is an email</p>', done);
      })
    })
  })

  describe('.render(name, option)', function(){
    it('should render the template', function(done){
      var app = express();

      app.set('views', __dirname + '/fixtures');

      var user = { name: 'tobi' };

      app.use(function(req, res){
        res.render('user.jade', { user: user });
      });

      request(app)
      .get('/')
      .expect('<p>tobi</p>', done);
    })

    it('should expose app.locals', function(done){
      var app = express();

      app.set('views', __dirname + '/fixtures');
      app.locals.user = { name: 'tobi' };

      app.use(function(req, res){
        res.render('user.jade');
      });

      request(app)
      .get('/')
      .expect('<p>tobi</p>', done);
    })

    it('should expose res.locals', function(done){
      var app = express();

      app.set('views', __dirname + '/fixtures');

      app.use(function(req, res){
        res.locals.user = { name: 'tobi' };
        res.render('user.jade');
      });

      request(app)
      .get('/')
      .expect('<p>tobi</p>', done);
    })

    it('should give precedence to res.locals over app.locals', function(done){
      var app = express();

      app.set('views', __dirname + '/fixtures');
      app.locals.user = { name: 'tobi' };

      app.use(function(req, res){
        res.locals.user = { name: 'jane' };
        res.render('user.jade', {});
      });

      request(app)
      .get('/')
      .expect('<p>jane</p>', done);
    })

    it('should give precedence to res.render() locals over res.locals', function(done){
      var app = express();

      app.set('views', __dirname + '/fixtures');
      var jane = { name: 'jane' };

      app.use(function(req, res){
        res.locals.user = { name: 'tobi' };
        res.render('user.jade', { user: jane });
      });

      request(app)
      .get('/')
      .expect('<p>jane</p>', done);
    })

    it('should give precedence to res.render() locals over app.locals', function(done){
      var app = express();

      app.set('views', __dirname + '/fixtures');
      app.locals.user = { name: 'tobi' };
      var jane = { name: 'jane' };

      app.use(function(req, res){
        res.render('user.jade', { user: jane });
      });

      request(app)
      .get('/')
      .expect('<p>jane</p>', done);
    })
  })

  describe('.render(name, options, fn)', function(){
    it('should pass the resulting string', function(done){
      var app = express();

      app.set('views', __dirname + '/fixtures');

      app.use(function(req, res){
        var tobi = { name: 'tobi' };
        res.render('user.jade', { user: tobi }, function(err, html){
          html = html.replace('tobi', 'loki');
          res.end(html);
        });
      });

      request(app)
      .get('/')
      .expect('<p>loki</p>', done);
    })
  })

  describe('.render(name, fn)', function(){
    it('should pass the resulting string', function(done){
      var app = express();

      app.set('views', __dirname + '/fixtures');

      app.use(function(req, res){
        res.locals.user = { name: 'tobi' };
        res.render('user.jade', function(err, html){
          html = html.replace('tobi', 'loki');
          res.end(html);
        });
      });

      request(app)
      .get('/')
      .expect('<p>loki</p>', done);
    })

    describe('when an error occurs', function(){
      it('should pass it to the callback', function(done){
        var app = express();

        app.set('views', __dirname + '/fixtures');

        app.use(function(req, res){
          res.render('user.jade', function(err){
            res.end(err.message);
          });
        });

        request(app)
        .get('/')
        .expect(/Cannot read property 'name' of undefined/, done);
      })
    })
  })
})
