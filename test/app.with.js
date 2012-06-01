
var express = require('../')
  , request = require('./support/http');

describe('app.with()', function(){
  it('should append a prefix to the url', function(done){
    var app = express();

    app.with('myPrefix', function () {
      app.del('/tobi', function(req, res){
        res.end('deleted tobi!');
      });
    });

    request(app)
    .delete('/myPrefix/tobi')
    .expect('deleted tobi!', done);
  })
})
