'use strict';

// Set test environment before requiring app
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('./index');

describe('Hello World App', function() {
  describe('GET /', function() {
    it('should return Hello World', function(done) {
      request(app)
        .get('/')
        .expect(200)
        .expect('Hello World', done);
    });
  });

  describe('GET /health', function() {
    it('should return healthy status', function(done) {
      request(app)
        .get('/health')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ status: 'healthy' }, done);
    });
  });
});