
var express = require('../')

describe('app.listen()', function(){
  it('should wrap with an HTTP server', function(done){
    var app = express();

    app.get('/tobi', function(req, res){
      res.end('got tobi!');
    });

    var server = app.listen(9999, function(){
      server.close();
      done();
    });
  })
})
