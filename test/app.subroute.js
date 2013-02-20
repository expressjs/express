var express = require('../')
  , request = require('./support/http')
  , methods = require('methods');

describe('app.subroute.js', function(){
  describe('methods supported', function(){
    methods.forEach(function(method){
      it('should include ' + method.toUpperCase(), function(done){
        if (method === 'delete') method = 'del';
        var app = express();
        var calls = [];

        app.subroute('/foo')[method](function(req, res){
          if ('head' == method) {
            res.end();
          } else {
            res.end(method);
          }
        }).end();

        request(app)
        [method]('/foo')
        .expect('head' == method ? '' : method, done);
      })
    })
  })

  describe('options supported', function(){
    methods.forEach(function(method){
      it('should include ' + method.toUpperCase(), function(done){
        if (method === 'delete') method = 'del';
        var app = express();
        var calls = [];

        if (method !== 'options') {
          app.subroute('/foo')[method](function(req, res){
            if ('head' == method) {
              res.end();
            } else {
              res.end(method);
            }
          }).end();
        } else {
          app.subroute('/foo').end();
        }

        request(app)
        .options('/foo')
        .expect('Allow', method == 'options' ? 'OPTIONS'
          : method == 'del' ? 'DELETE,OPTIONS'
          : method == 'get' ? 'GET,HEAD,OPTIONS'
          : method.toUpperCase() + ',OPTIONS', done);
      })
    })
  })

  it('should disallow methods', function(done){
    var app = express();
    var calls = [];

    app.subroute('/foo').get(function(req, res){
      res.end('get');
    }).end();

    request(app)
    .post('/foo')
    .expect(405, done);
  })

  /*
  it('show allow HEAD for GET', function(done){
    var app = express();
    var calls = [];

    app.subroute('/foo').get(function(req, res){
      if (req.method === 'HEAD') {
        res.end();
      } else {
        res.end('get');
      }
    }).end();

    request(app)
    .head('/foo')
    .expect(200, done);
  })
  */
})