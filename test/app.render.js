
var express = require('../')
  , assert = require('assert');

describe('app', function(){
  describe('.render(name, fn)', function(){
    describe('when an extension is given', function(){
      it('should render the template', function(done){
        var app = express();

        app.set('views', __dirname + '/fixtures');

        app.render('email.jade', function(err, str){
          assert(null == err);
          str.should.equal('<p>This is an email</p>');
          done();
        })
      })
    })

    describe('when "view engine" is given', function(){
      it('should render the template', function(done){
        var app = express();

        app.set('view engine', 'jade');
        app.set('views', __dirname + '/fixtures');

        app.render('email', function(err, str){
          assert(null == err);
          str.should.equal('<p>This is an email</p>');
          done();
        })
      })
    })
  })
})
