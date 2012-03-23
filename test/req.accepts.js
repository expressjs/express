var express = require('../')
  , request = require('./support/http');

describe('req', function(){
  describe('.accepts(type)', function(){
    it('should return the type when Accept is not present', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts('json') === true ? 'yes' : 'no');
      });

      request(app)
      .get('/')
      .expect('yes', done);
    })

    it('should return the type when it is present', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts('json') === true ? 'yes' : 'no');
      });

      request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('yes', done);
    })

    it('should return false otherwise', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts('json') === false ? 'yes' : 'no');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/html')
      .expect('yes', done);
    })

    it('should return null when there is no acceptable match', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts(['html']) === false ? 'pass' : 'nope');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/javascript')
      .expect('pass', done);
    })

    it('should return the first type when there is no Accept header', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts(['html']));
      });

      request(app)
      .get('/')
      .expect('text/html', done);
    })

    it('should return the first type when there is no Accept header', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts(['goobly/gook']));
      });

      request(app)
      .get('/')
      .expect('goobly/gook', done);
    })

    it('should return the first passed type if multiple match', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts(['text/javascript', 'text/html']));
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
        res.end(req.accepts(
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
