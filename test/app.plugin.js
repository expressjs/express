
var express = require('../')
  , request = require('./support/http');

describe('app', function(){
  describe('.plugin(plugin, param...)', function(){
    it('should execute the plugin fn with this and param...', function(){
      var app = express()
        , plugin = function plugin(param0, param1, param2) {
	        	this.should.equal(app);
	        	param0.should.eql(params[0]);
	        	param1.should.eql(params[1]);
	        	param2.should.eql(params[2]);
	        }
	      , params = ["param0", "param1", "param2"];

      app.plugin(plugin, params[0], params[1], params[2]);
    })
  })
})
