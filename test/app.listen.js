
var express = require('../')

describe('app.listen()', function(){
  it('should wrap with an HTTP server', function(done){
    var app = express();

    var server = app.listen(9999, function(){
      server.close();
      done();
    });
  })
})
