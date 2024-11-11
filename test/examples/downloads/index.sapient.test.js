const assert = require('assert');
const request = require('supertest');
const path = require('path');
const fs = require('fs');

// Import the Express app
const app = require('../../../examples/downloads/index.js');

describe('Express Downloads App', function() {
  it('should return HTML with download links on GET /', function(done) {
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert(res.text.includes('Download <a href="/files/notes/groceries.txt">notes/groceries.txt</a>'));
        assert(res.text.includes('Download <a href="/files/amazing.txt">amazing.txt</a>'));
        assert(res.text.includes('Download <a href="/files/missing.txt">missing.txt</a>'));
        assert(res.text.includes('Download <a href="/files/CCTV大赛上海分赛区.txt">CCTV大赛上海分赛区.txt</a>'));
        done();
      });
  });

  it('should download an existing file', function(done) {
    const testFilePath = path.join(__dirname, '../../../examples/downloads/files/amazing.txt');
    const testFileContent = 'This is an amazing test file.';

    // Create a test file
    fs.writeFileSync(testFilePath, testFileContent);

    request(app)
      .get('/files/amazing.txt')
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect('Content-Disposition', 'attachment; filename="amazing.txt"')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.strictEqual(res.text, testFileContent);
        
        // Clean up the test file
        fs.unlinkSync(testFilePath);
        done();
      });
  });

  it('should return 404 for a non-existent file', function(done) {
    request(app)
      .get('/files/nonexistent.txt')
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);
        assert.strictEqual(res.text, 'Cant find that file, sorry!');
        done();
      });
  });

  it('should handle files with non-ASCII characters in the name', function(done) {
    const fileName = 'CCTV大赛上海分赛区.txt';
    const encodedFileName = encodeURIComponent(fileName);
    const testFilePath = path.join(__dirname, '../../../examples/downloads/files', fileName);
    const testFileContent = 'File with non-ASCII characters in the name.';

    // Create a test file
    fs.writeFileSync(testFilePath, testFileContent);

    request(app)
      .get(`/files/${encodedFileName}`)
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect(function(res) {
        const contentDisposition = res.headers['content-disposition'];
        assert(contentDisposition.startsWith('attachment; filename='), 'Content-Disposition should start with "attachment; filename="');
        assert(contentDisposition.includes(fileName) || contentDisposition.includes(encodeURIComponent(fileName)), 'Content-Disposition should include the filename or its encoded version');
      })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.strictEqual(res.text, testFileContent);
        
        // Clean up the test file
        fs.unlinkSync(testFilePath);
        done();
      });
  });

  it('should handle nested file paths', function(done) {
    const testFilePath = path.join(__dirname, '../../../examples/downloads/files/notes/groceries.txt');
    const testFileContent = 'Milk, Bread, Eggs';

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(testFilePath), { recursive: true });

    // Create a test file
    fs.writeFileSync(testFilePath, testFileContent);

    request(app)
      .get('/files/notes/groceries.txt')
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect('Content-Disposition', 'attachment; filename="groceries.txt"')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.strictEqual(res.text, testFileContent);
        
        // Clean up the test file
        fs.unlinkSync(testFilePath);
        fs.rmdirSync(path.dirname(testFilePath));
        done();
      });
  });
});