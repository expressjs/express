
var express = require('../');

describe('middleware', function(){
  describe('.use()', function(){
    it('should work like connect', function(done){
      var app = express();

      app.use(express.bodyParser());

      app.use(function(req, res){
        console.log(req.body);
        res.end('ok');
      });

      
    })
  })
})