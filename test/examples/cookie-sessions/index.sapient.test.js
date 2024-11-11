const assert = require('assert');
const request = require('supertest');
const app = require('../../../examples/cookie-sessions/index.js');

describe('Cookie Session App', function() {
  it('should increment session count and return correct message', function(done) {
    const agent = request.agent(app);
    
    agent
      .get('/')
      .expect(200)
      .expect('Content-Type', /text/)
      .expect('viewed 1 times\n')
      .end(function(err, res) {
        if (err) return done(err);
        
        // Make a second request to check if count increments
        agent
          .get('/')
          .expect(200)
          .expect('Content-Type', /text/)
          .expect('viewed 2 times\n')
          .end(done);
      });
  });

  it('should start a new session for a new client', function(done) {
    const agent = request.agent(app);
    
    agent
      .get('/')
      .expect(200)
      .expect('Content-Type', /text/)
      .expect('viewed 1 times\n')
      .end(function(err, res) {
        if (err) return done(err);
        
        // Create a new agent (simulating a new client) and make a request
        const newAgent = request.agent(app);
        newAgent
          .get('/')
          .expect(200)
          .expect('Content-Type', /text/)
          .expect('viewed 1 times\n')
          .end(done);
      });
  });

  it('should maintain session across multiple requests', function(done) {
    const agent = request.agent(app);
    
    agent
      .get('/')
      .expect(200)
      .expect('viewed 1 times\n')
      .end(function(err, res) {
        if (err) return done(err);
        
        agent
          .get('/')
          .expect(200)
          .expect('viewed 2 times\n')
          .end(function(err, res) {
            if (err) return done(err);
            
            agent
              .get('/')
              .expect(200)
              .expect('viewed 3 times\n')
              .end(done);
          });
      });
  });
});