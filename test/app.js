
var express = require('../');

describe('app', function(){
  it('should inherit from event emitter', function(done){
    var app = express();
    app.on('foo', done);
    app.emit('foo');
  })
})
