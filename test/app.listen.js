
var express = require('../')
var assert = require('assert')
var request = require('supertest')

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
  it('should callback on HTTP server errors', function (done) {
    var app1 = express()
    var app2 = express()

    var server1 = app1.listen(0, function (err) {
      assert(!err)
      var server2 = app2.listen(server1.address().port, function (err) {
        assert(err.code === 'EADDRINUSE')
        server1.close()
        done()
      })
    })
  })
})
