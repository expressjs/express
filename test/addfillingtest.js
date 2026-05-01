const express = require('../');
const request = require('supertest');
const assert = require('assert');
it('should reproduce issue #3367', function(done) {
    var app = express();
    
  
    app.get('/', function(req, res) {
      res.sendStatus(204); // example
    });
  
    request(app)
      .get('/')
      .expect(204, done);
  });