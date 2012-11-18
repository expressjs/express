var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.etag', function(){
    it('should send ETag when enabled', function(done){
      var app = express();

      app.use(function(req, res){
        var str = Array(1024 * 2).join('-');
        res.send(str);
      });

      request(app)
      .get('/')
      .end(function(err, res){
        res.headers.should.have.property('etag', '"-1498647312"');
        done();
      });
    });

    it('should send no ETag when disabled', function(done){
      var app = express();

      app.use(function(req, res){
        var str = Array(1024 * 2).join('-');
        res.send(str);
      });

      app.disable('etag');

      request(app)
      .get('/')
      .end(function(err, res){
        res.headers.should.not.have.property('ETag');
        done();
      });
    });

    it('should send ETag when disabled but manually set', function(done){
      var app = express();

      app.disable('etag');

      app.use(function(req, res){
        res.set('ETag', 1);
        res.send(200);
      });

      request(app)
      .get('/')
      .end(function(err, res){
        res.headers.should.have.property('etag');
        done();
      });
    });
  })
})
