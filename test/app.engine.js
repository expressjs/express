
var express = require('../')
  , request = require('./support/http')
  , fs = require('fs');

function render(path, options, fn) {
  fs.readFile(path, 'utf8', function(err, str){
    if (err) return fn(err);
    str = str.replace('{{user.name}}', options.user.name);
    fn(null, str);
  });
}

function streaming_render(path, options, fn) {
  return fs.createReadStream(path, { encoding: 'utf-8' });
}

describe('app', function(){
  describe('.engine(ext, fn)', function(){
    it('should map a template engine', function(done){
      var app = express();

      app.set('views', __dirname + '/fixtures');
      app.engine('.html', render);
      app.locals.user = { name: 'tobi' };

      app.render('user.html', function(err, str){
        if (err) return done(err);
        str.should.equal('<p>tobi</p>');
        done();
      })
    })

    it('should throw when the callback is missing', function(){
      var app = express();
      (function(){
        app.engine('.html', null);
      }).should.throw('callback function required');
    })

    it('should work without leading "."', function(done){
      var app = express();

      app.set('views', __dirname + '/fixtures');
      app.engine('html', render);
      app.locals.user = { name: 'tobi' };

      app.render('user.html', function(err, str){
        if (err) return done(err);
        str.should.equal('<p>tobi</p>');
        done();
      })
    })
    
    it('should work "view engine" setting', function(done){
      var app = express();

      app.set('views', __dirname + '/fixtures');
      app.engine('html', render);
      app.set('view engine', 'html');
      app.locals.user = { name: 'tobi' };

      app.render('user', function(err, str){
        if (err) return done(err);
        str.should.equal('<p>tobi</p>');
        done();
      })
    })
    
    it('should work "view engine" with leading "."', function(done){
      var app = express();

      app.set('views', __dirname + '/fixtures');
      app.engine('.html', render);
      app.set('view engine', '.html');
      app.locals.user = { name: 'tobi' };

      app.render('user', function(err, str){
        if (err) return done(err);
        str.should.equal('<p>tobi</p>');
        done();
      })
    })

    it('should support streaming engines', function(done) {
      var app = express();
      app.set('views', __dirname + '/fixtures');
      app.engine('.html', streaming_render);
      app.set('view engine', '.html');
      app.locals.user = { name: 'tobi' };

      // using function should just call the function when done
      app.render('user', function(err, str){
        if (err) return done(err);
        str.should.equal('<p>{{user.name}}</p>');
        done();
      })
    });

    it('should render a response using the streaming engine', function(done) {
      var app = express();
      app.set('views', __dirname + '/fixtures');
      app.engine('.html', streaming_render);
      app.set('view engine', '.html');
      app.locals.user = { name: 'tobi' };

      app.get('/', function(req, res) {
        res.render('user');
      });

      request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.header['transfer-encoding'].should.equal('chunked');
        res.text.should.equal('<p>{{user.name}}</p>');
        done();
      });
    });
  })
})
