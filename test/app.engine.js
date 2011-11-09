
var express = require('../')
  , assert = require('assert');

function render(str, options, fn) {
  str = str.replace('{{user.name}}', options.user.name);
  fn(null, str);
}

describe('app', function(){
  describe('.engine(ext, fn)', function(){
    it('should map a template engine', function(){
      var app = express();

      app.set('views', __dirname + '/fixtures');
      app.engine('.html', render);
      app.locals.user = { name: 'tobi' };

      app.render('user.html', function(err, str){
        assert(null == err);
        str.should.equal('<p>tobi</p>');
      })
    })
    
    it('should work without leading "."', function(){
      var app = express();

      app.set('views', __dirname + '/fixtures');
      app.engine('html', render);
      app.locals.user = { name: 'tobi' };

      app.render('user.html', function(err, str){
        assert(null == err);
        str.should.equal('<p>tobi</p>');
      })
    })
    
    it('should work "view engine" setting', function(){
      var app = express();

      app.set('views', __dirname + '/fixtures');
      app.engine('html', render);
      app.set('view engine', 'html');
      app.locals.user = { name: 'tobi' };

      app.render('user', function(err, str){
        assert(null == err);
        str.should.equal('<p>tobi</p>');
      })
    })
  })
})
