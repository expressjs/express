
var express = require('../')
  , Router = express.Router
  , request = require('./support/http');

describe('Router', function(){
  var router, app;

  beforeEach(function(){
    router = new Router;
    app = express();
  })

  describe('.middleware', function(){
    it('should dispatch', function(done){
      router.route('get', '/foo', function(req, res){
        res.send('foo');
      });

      app.use(router.middleware);

      request(app)
      .get('/foo')
      .expect('foo', done);
    })
  })
})