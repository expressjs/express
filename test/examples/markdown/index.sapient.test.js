const assert = require('assert');
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const marked = require('marked');
const escapeHtml = require('escape-html');

// Import the app
const app = require('../../../examples/markdown/index.js');

describe('Markdown Example App', function() {
  describe('GET /', function() {
    it('should render the index page with correct title', function(done) {
      request(app)
        .get('/')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.text.includes('Markdown Example'));
          done();
        });
    });
  });

  describe('GET /fail', function() {
    it('should return 500 when trying to render a missing file', function(done) {
      request(app)
        .get('/fail')
        .expect(500, done);
    });
  });

  describe('Custom Markdown engine', function() {
    let originalReadFile;
    let originalMarkedParse;

    beforeEach(function() {
      originalReadFile = fs.readFile;
      originalMarkedParse = marked.parse;
    });

    afterEach(function() {
      fs.readFile = originalReadFile;
      marked.parse = originalMarkedParse;
    });

    it('should process markdown file correctly', function(done) {
      const mockMarkdown = '# Hello {title}';
      const mockHtml = '<h1>Hello Test</h1>';
      
      fs.readFile = (filePath, encoding, callback) => {
        callback(null, mockMarkdown);
      };
      marked.parse = (str) => '<h1>Hello {title}</h1>';

      app.render('index', { title: 'Test' }, function(err, html) {
        if (err) return done(err);
        assert.strictEqual(html, mockHtml);
        done();
      });
    });

    it('should handle file read errors', function(done) {
      fs.readFile = (filePath, encoding, callback) => {
        callback(new Error('File not found'));
      };

      app.render('index', {}, function(err) {
        assert(err instanceof Error);
        assert.strictEqual(err.message, 'File not found');
        done();
      });
    });
  });

  describe('App configuration', function() {
    it('should set the correct view engine', function() {
      assert.strictEqual(app.get('view engine'), 'md');
    });

    it('should set the correct views directory', function() {
      const expectedPath = path.join(__dirname, '../../../examples/markdown/views');
      assert.strictEqual(app.get('views'), expectedPath);
    });
  });

  describe('Error handling', function() {
    it('should handle errors when rendering non-existent views', function(done) {
      request(app)
        .get('/fail')
        .expect(500)
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.text.includes('Failed to lookup view "missing"'));
          done();
        });
    });
  });
});