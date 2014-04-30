
var express = require('../');
var request = require('supertest');
var assert = require('assert');

describe('HEAD', function(){
  it('should default to GET', function(done){
    var app = express();

    app.get('/tobi', function(req, res){
      // send() detects HEAD
      res.send('tobi');
    });

    request(app)
    .head('/tobi')
    .expect(200, done);
  })

  it('should output the same headers is GET or HEAD requests', function(done){
    var app = express(),
        headersGET,
        headersHEAD,
        compareHeaders;

    compareHeaders = function(){
      var keysHEAD, keysGET;
      if(!headersHEAD || !headersGET){
        return;
      }
      keysHEAD = Object.keys(headersHEAD);
      keysGET = Object.keys(headersGET);

      assert.equal(keysHEAD.length, keysGET.length);

      keysGET.forEach(function(key){
        assert.equal(headersGET[key], headersHEAD[key]);
      });

      done();
    };
    
    app.get('/tobi', function(req, res){
      // send() detects HEAD
      res.send('tobi');
    });

    request(app)
      .head('/tobi')
      .expect(200)
      .end(function(err, response){
        headersHEAD = response.headers;
        compareHeaders();
      });

    request(app)
      .get('/tobi')
      .expect(200)
      .end(function(err, response){
        headersGET = response.headers;
        compareHeaders();
      });
  })
})

describe('app.head()', function(){
  it('should override', function(done){
    var app = express()
      , called;

    app.head('/tobi', function(req, res){
      called = true;
      res.end('');
    });

    app.get('/tobi', function(req, res){
      assert(0, 'should not call GET');
      res.send('tobi');
    });

    request(app)
    .head('/tobi')
    .expect(200, function(){
      assert(called);
      done();
    });
  })
})
