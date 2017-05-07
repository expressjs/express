
const express = require('../')

describe('app.listen()', function(){
  it('should wrap with an HTTP server', function(done){
    const app = express();

    app.del('/tobi', function(req, res){
      res.end('deleted tobi!');
    });

    const server = app.listen(9999, function(){
      server.close();
      done();
    });
  })
})
