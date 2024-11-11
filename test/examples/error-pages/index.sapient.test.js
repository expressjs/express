const assert = require('assert');
const request = require('supertest');
const path = require('path');

describe('Error Pages Express App', function() {
  let app;

  beforeEach(function() {
    delete require.cache[require.resolve('../../../examples/error-pages/index.js')];
    app = require('../../../examples/error-pages/index.js');
  });

  it('should render index page', function(done) {
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert(res.text.includes('Error Pages'));
        done();
      });
  });

  it('should return 404 for non-existent route', function(done) {
    request(app)
      .get('/nonexistent')
      .expect('Content-Type', /html/)
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);
        assert(res.text.includes('Cannot GET /nonexistent'));
        done();
      });
  });

  it('should handle 404 route', function(done) {
    request(app)
      .get('/404')
      .expect('Content-Type', /html/)
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);
        assert(res.text.includes('Cannot GET /404'));
        done();
      });
  });

  it('should handle 403 route', function(done) {
    request(app)
      .get('/403')
      .expect('Content-Type', /html/)
      .expect(403)
      .end(function(err, res) {
        if (err) return done(err);
        assert(res.text.includes('not allowed!'));
        done();
      });
  });

  it('should handle 500 route', function(done) {
    request(app)
      .get('/500')
      .expect('Content-Type', /html/)
      .expect(500)
      .end(function(err, res) {
        if (err) return done(err);
        assert(res.text.includes('keyboard cat!'));
        done();
      });
  });

  it('should return JSON for 404 with Accept: application/json', function(done) {
    request(app)
      .get('/nonexistent')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);
        assert.deepStrictEqual(res.body, { error: 'Not found' });
        done();
      });
  });

  it('should return plain text for 404 with Accept: text/plain', function(done) {
    request(app)
      .get('/nonexistent')
      .set('Accept', 'text/plain')
      .expect('Content-Type', /text\/plain/)
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);
        assert.strictEqual(res.text, 'Not found');
        done();
      });
  });

  it('should disable verbose errors in production', function(done) {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const prodApp = require('../../../examples/error-pages/index.js');
    assert.strictEqual(prodApp.get('verbose errors'), false);
    process.env.NODE_ENV = originalEnv;
    done();
  });

  it('should enable verbose errors in development', function(done) {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const devApp = require('../../../examples/error-pages/index.js');
    assert.strictEqual(devApp.get('verbose errors'), true);
    process.env.NODE_ENV = originalEnv;
    done();
  });

  it('should use logger middleware in non-test environment', function(done) {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const devApp = require('../../../examples/error-pages/index.js');
    assert(devApp._router.stack.some(layer => layer.name === 'logger'));
    process.env.NODE_ENV = originalEnv;
    done();
  });
});