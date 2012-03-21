
var express = require('../')
  , request = require('./support/http');

describe('req', function(){
  describe('.acceptBestMatch(type)', function(){
    it('should return null when there is no acceptable match', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.acceptBestMatch(['html']) == undefined ? 'pass' : 'nope');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/javascript')
      .expect('pass', done);
    })
    it('should return the first type when there is no Accept header', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.acceptBestMatch(['html']));
      });

      request(app)
      .get('/')
      .expect('text/html', done);
    })
    it('should return the first type when there is no Accept header', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.acceptBestMatch(['goobly/gook']));
      });

      request(app)
      .get('/')
      .expect('goobly/gook', done);
    })
    it('should return the first passed type if multiple match', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.acceptBestMatch(['text/javascript', 'text/html']));
      });

      request(app)
      .get('/')
      .set('Accept', 'text/html,text/javascript')
      .expect('text/javascript', done);
    })
    it('should return the highest quality passed type if multiple match',
                                                               function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.acceptBestMatch(
          ['application/javascript', 'text/javascript', 'text/html',
           'application/xml']));
      });

      request(app)
      .get('/')
      .set('Accept', 'text/html,text/javascript;q=0.9,application/xml;q=0.8')
      .expect('text/html', done);
    })
  })
})
