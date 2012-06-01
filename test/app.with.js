
var express = require('../')
  , request = require('./support/http');

describe('app.with()', function(){
  it('should append a prefix to the url', function(done){
    var app = express();

    app.with('/myPrefix', function () {
      app.del('/tobi', function(req, res){
        res.end('deleted tobi!');
      });
    });

    request(app)
    .delete('/myPrefix/tobi')
    .expect('deleted tobi!', done);
  });

  it('should work with / in the inner route', function(done){
    var app = express();

    app.with('/myPrefix', function () {
      app.del('/', function(req, res){
        res.end('deleted tobi!');
      });
    });

    request(app)
    .delete('/myPrefix')
    .expect('deleted tobi!', done);
  });

  it('should re-establish the prefix after the with is called', function(done){
    var app = express();

    app.with('/myPrefix', function () {
      app.del('/', function(req, res){
        res.end('deleted tobi!');
      });
    });

    app.get('/newone', function (req, res) {
      res.send('yay!')
    });

    request(app)
    .get('/newone')
    .expect('yay!', done);
  });

  it('should be able to nest prefixes', function(done){
    var app = express();

    app.with('/myPrefix', function () {
      app.with('/nested', function () {
        app.del('/tobi', function(req, res){
          res.end('deleted tobi!');
        });  
      });
    });

    request(app)
    .delete('/myPrefix/nested/tobi')
    .expect('deleted tobi!', done);
  });

  it('should re-establish nested prefixes', function (done){
    var app = express();

    app.with('/myPrefix', function () {
      app.with('/nested', function () {
        app.del('/tobi', function(req, res){
          res.end('deleted tobi!');
        });
      });
      app.get('/newone', function (req, res){
          res.end('yay!');
      });
    });

    request(app)
    .get('/myPrefix/newone')
    .expect('yay!', done);
  });
});