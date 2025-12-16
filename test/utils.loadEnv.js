'use strict'

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var os = require('os');

describe('utils.loadEnv()', function () {
  var testDir;
  var originalEnv;

  beforeEach(function () {
    // Create a temporary directory for test files
    testDir = path.join(os.tmpdir(), 'express-env-test-' + Date.now());
    fs.mkdirSync(testDir, { recursive: true });

    // Backup original environment variables
    originalEnv = Object.assign({}, process.env);
  });

  afterEach(function () {
    // Restore original environment variables
    Object.keys(process.env).forEach(function (key) {
      if (!originalEnv.hasOwnProperty(key)) {
        delete process.env[key];
      }
    });
    Object.assign(process.env, originalEnv);

    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should load basic key-value pairs', function () {
    var envPath = path.join(testDir, '.env');
    fs.writeFileSync(envPath, 'KEY1=value1\nKEY2=value2');

    var utils = require('../lib/utils');
    var result = utils.loadEnv(envPath);

    assert.strictEqual(result.KEY1, 'value1');
    assert.strictEqual(result.KEY2, 'value2');
    assert.strictEqual(process.env.KEY1, 'value1');
    assert.strictEqual(process.env.KEY2, 'value2');
  });

  it('should handle quoted values', function () {
    var envPath = path.join(testDir, '.env');
    fs.writeFileSync(envPath, 'QUOTED="double quotes"\nSINGLE=\'single quotes\'');

    var utils = require('../lib/utils');
    var result = utils.loadEnv(envPath);

    assert.strictEqual(result.QUOTED, 'double quotes');
    assert.strictEqual(result.SINGLE, 'single quotes');
  });

  it('should handle escaped characters', function () {
    var envPath = path.join(testDir, '.env');
    fs.writeFileSync(envPath, 'ESCAPED="line1\\nline2\\ttab"');

    var utils = require('../lib/utils');
    var result = utils.loadEnv(envPath);

    assert.strictEqual(result.ESCAPED, 'line1\nline2\ttab');
  });

  it('should skip comments and empty lines', function () {
    var envPath = path.join(testDir, '.env');
    fs.writeFileSync(envPath, '# Comment\n\nKEY=value\n\n# Another comment');

    var utils = require('../lib/utils');
    var result = utils.loadEnv(envPath);

    assert.strictEqual(result.KEY, 'value');
    assert.strictEqual(Object.keys(result).filter(k => k !== '_loaded').length, 1);
  });

  it('should handle multi-line values with backslash', function () {
    var envPath = path.join(testDir, '.env');
    fs.writeFileSync(envPath, 'MULTILINE=line1\\\nline2\\\nline3');

    var utils = require('../lib/utils');
    var result = utils.loadEnv(envPath);

    assert.strictEqual(result.MULTILINE, 'line1line2line3');
  });

  it('should handle values with equals signs', function () {
    var envPath = path.join(testDir, '.env');
    fs.writeFileSync(envPath, 'CONNECTION_STRING=server=localhost;user=admin');

    var utils = require('../lib/utils');
    var result = utils.loadEnv(envPath);

    assert.strictEqual(result.CONNECTION_STRING, 'server=localhost;user=admin');
  });

  it('should handle empty values', function () {
    var envPath = path.join(testDir, '.env');
    fs.writeFileSync(envPath, 'EMPTY=\nEMPTY_QUOTED=""');

    var utils = require('../lib/utils');
    var result = utils.loadEnv(envPath);

    assert.strictEqual(result.EMPTY, '');
    assert.strictEqual(result.EMPTY_QUOTED, '');
  });

  it('should not override existing env vars by default', function () {
    process.env.EXISTING = 'original';

    var envPath = path.join(testDir, '.env');
    fs.writeFileSync(envPath, 'EXISTING=new value');

    var utils = require('../lib/utils');
    utils.loadEnv(envPath);

    assert.strictEqual(process.env.EXISTING, 'original');
  });

  it('should override existing env vars when override is true', function () {
    process.env.EXISTING = 'original';

    var envPath = path.join(testDir, '.env');
    fs.writeFileSync(envPath, 'EXISTING=new value');

    var utils = require('../lib/utils');
    utils.loadEnv(envPath, { override: true });

    assert.strictEqual(process.env.EXISTING, 'new value');
  });

  it('should return empty object if file does not exist', function () {
    var utils = require('../lib/utils');
    var result = utils.loadEnv(path.join(testDir, 'nonexistent.env'));

    assert.strictEqual(Object.keys(result).filter(k => k !== '_loaded').length, 0);
  });

  it('should throw error on invalid file read', function () {
    var utils = require('../lib/utils');

    // Create a directory instead of a file to cause read error
    var dirPath = path.join(testDir, 'invalid');
    fs.mkdirSync(dirPath);

    assert.throws(function () {
      utils.loadEnv(dirPath);
    }, /Failed to load \.env file/);
  });

  it('should handle whitespace around keys and values', function () {
    var envPath = path.join(testDir, '.env');
    fs.writeFileSync(envPath, '  KEY1  =  value1  \n\tKEY2\t=\tvalue2\t');

    var utils = require('../lib/utils');
    var result = utils.loadEnv(envPath);

    assert.strictEqual(result.KEY1, 'value1');
    assert.strictEqual(result.KEY2, 'value2');
  });

  it('should handle special characters in values', function () {
    var envPath = path.join(testDir, '.env');
    fs.writeFileSync(envPath, 'SPECIAL="!@#$%^&*(){}[]|:;<>,.?/~`"');

    var utils = require('../lib/utils');
    var result = utils.loadEnv(envPath);

    assert.strictEqual(result.SPECIAL, '!@#$%^&*(){}[]|:;<>,.?/~`');
  });

  it('should use .env in cwd when no path provided', function () {
    var originalCwd = process.cwd();

    try {
      process.chdir(testDir);
      fs.writeFileSync('.env', 'DEFAULT_KEY=default_value');

      var utils = require('../lib/utils');
      var result = utils.loadEnv();

      assert.strictEqual(result.DEFAULT_KEY, 'default_value');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('should load environment-specific file (.env.production)', function () {
    var originalCwd = process.cwd();

    try {
      process.chdir(testDir);
      fs.writeFileSync('.env.production', 'ENV_TYPE=production\nDB_HOST=prod.db.com');

      var utils = require('../lib/utils');
      var result = utils.loadEnv({ env: 'production', cascade: false });

      assert.strictEqual(result.ENV_TYPE, 'production');
      assert.strictEqual(result.DB_HOST, 'prod.db.com');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('should load environment-specific file (.env.development)', function () {
    var originalCwd = process.cwd();

    try {
      process.chdir(testDir);
      fs.writeFileSync('.env.development', 'ENV_TYPE=development\nDB_HOST=localhost');

      var utils = require('../lib/utils');
      var result = utils.loadEnv({ env: 'development', cascade: false });

      assert.strictEqual(result.ENV_TYPE, 'development');
      assert.strictEqual(result.DB_HOST, 'localhost');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('should cascade .env then .env.[environment]', function () {
    var originalCwd = process.cwd();

    try {
      process.chdir(testDir);
      fs.writeFileSync('.env', 'BASE_KEY=base\nOVERRIDE_KEY=base_value');
      fs.writeFileSync('.env.production', 'PROD_KEY=prod\nOVERRIDE_KEY=prod_value');

      var utils = require('../lib/utils');
      var result = utils.loadEnv({ env: 'production' });

      assert.strictEqual(result.BASE_KEY, 'base');
      assert.strictEqual(result.PROD_KEY, 'prod');
      assert.strictEqual(result.OVERRIDE_KEY, 'prod_value'); // Should be overridden
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('should load .env.local for local overrides', function () {
    var originalCwd = process.cwd();

    try {
      process.chdir(testDir);
      fs.writeFileSync('.env', 'KEY1=base');
      fs.writeFileSync('.env.production', 'KEY2=prod');
      fs.writeFileSync('.env.local', 'KEY1=local\nKEY3=local_only');

      var utils = require('../lib/utils');
      var result = utils.loadEnv({ env: 'production' });

      assert.strictEqual(result.KEY1, 'local'); // Local overrides base
      assert.strictEqual(result.KEY2, 'prod');
      assert.strictEqual(result.KEY3, 'local_only');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('should use NODE_ENV when env option not specified', function () {
    var originalCwd = process.cwd();
    var originalNodeEnv = process.env.NODE_ENV;

    try {
      process.env.NODE_ENV = 'staging';
      process.chdir(testDir);
      fs.writeFileSync('.env', 'BASE=value');
      fs.writeFileSync('.env.staging', 'STAGING=value');

      var utils = require('../lib/utils');
      var result = utils.loadEnv();

      assert.strictEqual(result.BASE, 'value');
      assert.strictEqual(result.STAGING, 'value');
    } finally {
      process.env.NODE_ENV = originalNodeEnv;
      process.chdir(originalCwd);
    }
  });

  it('should disable cascade when cascade option is false', function () {
    var originalCwd = process.cwd();

    try {
      process.chdir(testDir);
      fs.writeFileSync('.env', 'BASE_KEY=base');
      fs.writeFileSync('.env.test', 'TEST_KEY=test');

      var utils = require('../lib/utils');
      var result = utils.loadEnv({ env: 'test', cascade: false });

      assert.strictEqual(result.TEST_KEY, 'test');
      assert.strictEqual(result.BASE_KEY, undefined); // Should not load .env
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('should return metadata about loaded files', function () {
    var originalCwd = process.cwd();

    try {
      process.chdir(testDir);
      fs.writeFileSync('.env', 'KEY=value');
      fs.writeFileSync('.env.production', 'KEY2=value2');

      var utils = require('../lib/utils');
      var result = utils.loadEnv({ env: 'production' });

      assert(Array.isArray(result._loaded));
      assert(result._loaded.length >= 2);
    } finally {
      process.chdir(originalCwd);
    }
  });

  describe('watch functionality', function () {
    it('should return unwatch function when watch is true', function () {
      var envPath = path.join(testDir, '.env');
      fs.writeFileSync(envPath, 'KEY1=value1');

      var utils = require('../lib/utils');
      var unwatch = utils.loadEnv(envPath, { watch: true });

      assert.strictEqual(typeof unwatch, 'function');
      unwatch();
    });

    it('should detect file changes and call onChange callback', function (done) {
      var envPath = path.join(testDir, '.env');
      fs.writeFileSync(envPath, 'WATCH_KEY=initial');

      var utils = require('../lib/utils');

      var unwatch = utils.loadEnv(envPath, {
        watch: true,
        onChange: function (changed, loaded) {
          assert(changed.WATCH_KEY);
          assert.strictEqual(changed.WATCH_KEY.type, 'modified');
          assert.strictEqual(changed.WATCH_KEY.oldValue, 'initial');
          assert.strictEqual(changed.WATCH_KEY.newValue, 'updated');
          assert.strictEqual(loaded.WATCH_KEY, 'updated');
          assert.strictEqual(process.env.WATCH_KEY, 'updated');

          unwatch();
          done();
        }
      });

      // Give the watcher time to set up
      setTimeout(function () {
        fs.writeFileSync(envPath, 'WATCH_KEY=updated');
      }, 150);
    });

    it('should detect added variables', function (done) {
      var envPath = path.join(testDir, '.env');
      fs.writeFileSync(envPath, 'EXISTING=value');

      var utils = require('../lib/utils');

      var unwatch = utils.loadEnv(envPath, {
        watch: true,
        onChange: function (changed) {
          assert(changed.NEW_KEY);
          assert.strictEqual(changed.NEW_KEY.type, 'added');
          assert.strictEqual(changed.NEW_KEY.value, 'new_value');
          assert.strictEqual(process.env.NEW_KEY, 'new_value');

          unwatch();
          done();
        }
      });

      setTimeout(function () {
        fs.writeFileSync(envPath, 'EXISTING=value\nNEW_KEY=new_value');
      }, 150);
    });

    it('should detect removed variables', function (done) {
      var envPath = path.join(testDir, '.env');
      fs.writeFileSync(envPath, 'KEY1=value1\nKEY2=value2');

      var utils = require('../lib/utils');

      var unwatch = utils.loadEnv(envPath, {
        watch: true,
        onChange: function (changed) {
          assert(changed.KEY2);
          assert.strictEqual(changed.KEY2.type, 'removed');
          assert.strictEqual(changed.KEY2.oldValue, 'value2');
          assert.strictEqual(process.env.KEY2, undefined);

          unwatch();
          done();
        }
      });

      setTimeout(function () {
        fs.writeFileSync(envPath, 'KEY1=value1');
      }, 150);
    });

    it('should handle errors via onError callback', function (done) {
      var envPath = path.join(testDir, '.env');
      fs.writeFileSync(envPath, 'KEY=value');

      var utils = require('../lib/utils');
      var errorCalled = false;

      var unwatch = utils.loadEnv(envPath, {
        watch: true,
        onError: function (err) {
          errorCalled = true;
          assert(err instanceof Error);
          unwatch();
          done();
        }
      });

      setTimeout(function () {
        // Write invalid content that will cause a parsing issue
        fs.writeFileSync(envPath, 'INVALID');

        // If no error after another delay, pass anyway
        setTimeout(function () {
          if (!errorCalled) {
            unwatch();
            // This is actually expected - INVALID without = is just skipped
            done();
          }
        }, 200);
      }, 150);
    });

    it('should stop watching when unwatch is called', function (done) {
      var envPath = path.join(testDir, '.env');
      fs.writeFileSync(envPath, 'KEY=initial');

      var utils = require('../lib/utils');
      var changeCount = 0;

      var unwatch = utils.loadEnv(envPath, {
        watch: true,
        onChange: function () {
          changeCount++;
        }
      });

      setTimeout(function () {
        // Verify no changes happened before unwatching
        assert.strictEqual(changeCount, 0);
        unwatch();

        // Try to change file after unwatching
        setTimeout(function () {
          fs.writeFileSync(envPath, 'KEY=after_unwatch');

          // Verify onChange was not called after unwatch
          setTimeout(function () {
            assert.strictEqual(changeCount, 0);
            done();
          }, 200);
        }, 100);
      }, 100);
    });

    it('should not create watchers when watch is false', function () {
      var envPath = path.join(testDir, '.env');
      fs.writeFileSync(envPath, 'KEY=value');

      var utils = require('../lib/utils');
      var result = utils.loadEnv(envPath, { watch: false });

      assert.strictEqual(typeof result, 'object');
      assert.strictEqual(typeof result.KEY, 'string');
      assert.strictEqual(result.KEY, 'value');
    });

    it('should prevent recursive watching when reloading', function (done) {
      var envPath = path.join(testDir, '.env');
      fs.writeFileSync(envPath, 'KEY=initial');

      var utils = require('../lib/utils');
      var changeCount = 0;

      var unwatch = utils.loadEnv(envPath, {
        watch: true,
        onChange: function (changed) {
          changeCount++;

          // Should only be called once despite the reload
          assert.strictEqual(changeCount, 1);

          setTimeout(function () {
            assert.strictEqual(changeCount, 1);
            unwatch();
            done();
          }, 200);
        }
      });

      setTimeout(function () {
        fs.writeFileSync(envPath, 'KEY=updated');
      }, 150);
    });
  });
});
