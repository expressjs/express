
var express = require('../')
  , request = require('supertest');

describe('res', function(){
  describe('.attachment()', function(){
    it('should Content-Disposition to attachment', function(done){
      var app = express();

      app.use(function(req, res){
        res.attachment().send('foo');
      });

      request(app)
      .get('/')
      .expect('Content-Disposition', 'attachment', done);
    })
  })

  describe('.attachment(filename)', function(){
    it('should add the filename param', function(done){
      var app = express();

      app.use(function(req, res){
        res.attachment('/path/to/image.png');
        res.send('foo');
      });

      request(app)
      .get('/')
      .expect('Content-Disposition', 'attachment; filename="image.png"', done);
    })

    it('should set the Content-Type', function(done){
      var app = express();

      app.use(function(req, res){
        res.attachment('/path/to/image.png');
        res.send(new Buffer(4));
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'image/png', done);
    })
  })
})
