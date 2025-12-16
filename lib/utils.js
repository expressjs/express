/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @api private
 */

var { METHODS } = require('node:http');
var contentType = require('content-type');
var etag = require('etag');
var mime = require('mime-types')
var proxyaddr = require('proxy-addr');
var qs = require('qs');
var querystring = require('node:querystring');
const { Buffer } = require('node:buffer');
const fs = require('node:fs');
const path = require('node:path');


/**
 * A list of lowercased HTTP methods that are supported by Node.js.
 * @api private
 */
exports.methods = METHODS.map((method) => method.toLowerCase());

/**
 * Return strong ETag for `body`.
 *
 * @param {String|Buffer} body
 * @param {String} [encoding]
 * @return {String}
 * @api private
 */

exports.etag = createETagGenerator({ weak: false })

/**
 * Return weak ETag for `body`.
 *
 * @param {String|Buffer} body
 * @param {String} [encoding]
 * @return {String}
 * @api private
 */

exports.wetag = createETagGenerator({ weak: true })

/**
 * Normalize the given `type`, for example "html" becomes "text/html".
 *
 * @param {String} type
 * @return {Object}
 * @api private
 */

exports.normalizeType = function(type){
  return ~type.indexOf('/')
    ? acceptParams(type)
    : { value: (mime.lookup(type) || 'application/octet-stream'), params: {} }
};

/**
 * Normalize `types`, for example "html" becomes "text/html".
 *
 * @param {Array} types
 * @return {Array}
 * @api private
 */

exports.normalizeTypes = function(types) {
  return types.map(exports.normalizeType);
};


/**
 * Parse accept params `str` returning an
 * object with `.value`, `.quality` and `.params`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function acceptParams (str) {
  var length = str.length;
  var colonIndex = str.indexOf(';');
  var index = colonIndex === -1 ? length : colonIndex;
  var ret = { value: str.slice(0, index).trim(), quality: 1, params: {} };

  while (index < length) {
    var splitIndex = str.indexOf('=', index);
    if (splitIndex === -1) break;

    var colonIndex = str.indexOf(';', index);
    var endIndex = colonIndex === -1 ? length : colonIndex;

    if (splitIndex > endIndex) {
      index = str.lastIndexOf(';', splitIndex - 1) + 1;
      continue;
    }

    var key = str.slice(index, splitIndex).trim();
    var value = str.slice(splitIndex + 1, endIndex).trim();

    if (key === 'q') {
      ret.quality = parseFloat(value);
    } else {
      ret.params[key] = value;
    }

    index = endIndex + 1;
  }

  return ret;
}

/**
 * Compile "etag" value to function.
 *
 * @param  {Boolean|String|Function} val
 * @return {Function}
 * @api private
 */

exports.compileETag = function(val) {
  var fn;

  if (typeof val === 'function') {
    return val;
  }

  switch (val) {
    case true:
    case 'weak':
      fn = exports.wetag;
      break;
    case false:
      break;
    case 'strong':
      fn = exports.etag;
      break;
    default:
      throw new TypeError('unknown value for etag function: ' + val);
  }

  return fn;
}

/**
 * Compile "query parser" value to function.
 *
 * @param  {String|Function} val
 * @return {Function}
 * @api private
 */

exports.compileQueryParser = function compileQueryParser(val) {
  var fn;

  if (typeof val === 'function') {
    return val;
  }

  switch (val) {
    case true:
    case 'simple':
      fn = querystring.parse;
      break;
    case false:
      break;
    case 'extended':
      fn = parseExtendedQueryString;
      break;
    default:
      throw new TypeError('unknown value for query parser function: ' + val);
  }

  return fn;
}

/**
 * Compile "proxy trust" value to function.
 *
 * @param  {Boolean|String|Number|Array|Function} val
 * @return {Function}
 * @api private
 */

exports.compileTrust = function(val) {
  if (typeof val === 'function') return val;

  if (val === true) {
    // Support plain true/false
    return function(){ return true };
  }

  if (typeof val === 'number') {
    // Support trusting hop count
    return function(a, i){ return i < val };
  }

  if (typeof val === 'string') {
    // Support comma-separated values
    val = val.split(',')
      .map(function (v) { return v.trim() })
  }

  return proxyaddr.compile(val || []);
}

/**
 * Set the charset in a given Content-Type string.
 *
 * @param {String} type
 * @param {String} charset
 * @return {String}
 * @api private
 */

exports.setCharset = function setCharset(type, charset) {
  if (!type || !charset) {
    return type;
  }

  // parse type
  var parsed = contentType.parse(type);

  // set charset
  parsed.parameters.charset = charset;

  // format type
  return contentType.format(parsed);
};

/**
 * Create an ETag generator function, generating ETags with
 * the given options.
 *
 * @param {object} options
 * @return {function}
 * @private
 */

function createETagGenerator (options) {
  return function generateETag (body, encoding) {
    var buf = !Buffer.isBuffer(body)
      ? Buffer.from(body, encoding)
      : body

    return etag(buf, options)
  }
}

/**
 * Parse an extended query string with qs.
 *
 * @param {String} str
 * @return {Object}
 * @private
 */

function parseExtendedQueryString(str) {
  return qs.parse(str, {
    allowPrototypes: true
  });
}

/**
 * Load environment variables from .env file
 *
 * @param {String|Object} [envPath]
 * @param {Object} [options]
 * @param {Boolean} [options.override]
 * @param {String} [options.env]
 * @param {Boolean} [options.cascade]
 * @param {Boolean} [options.watch]
 * @param {Function} [options.onChange]
 * @param {Function} [options.onError]
 * @return {Object|Function}
 * @api private
 */

exports.loadEnv = function loadEnv(envPath, options) {

  if (typeof envPath === 'object' && envPath !== null && !Array.isArray(envPath)) {
    options = envPath;
    envPath = undefined;
  }

  options = options || {};
  const override = options.override === true;
  const cascade = options.cascade !== false; // Default to true
  const nodeEnv = options.env || process.env.NODE_ENV;

  var filesToLoad = [];
  var baseDir = process.cwd();

  // If specific path provided, use it
  if (envPath) {
    filesToLoad.push(path.resolve(envPath));
  } else {
    // Default behavior: load .env and optionally .env.[NODE_ENV]
    var baseEnvPath = path.resolve(baseDir, '.env');

    if (cascade) {
      // Load .env first, then .env.[environment]
      filesToLoad.push(baseEnvPath);

      if (nodeEnv) {
        filesToLoad.push(path.resolve(baseDir, '.env.' + nodeEnv));
      }
    } else if (nodeEnv) {
      // Only load .env.[environment]
      filesToLoad.push(path.resolve(baseDir, '.env.' + nodeEnv));
    } else {
      // Only load .env
      filesToLoad.push(baseEnvPath);
    }

    // Always try to load .env.local (for local overrides)
    var localEnvPath = path.resolve(baseDir, '.env.local');
    if (filesToLoad.indexOf(localEnvPath) === -1) {
      filesToLoad.push(localEnvPath);
    }
  }

  var allParsed = {};
  var loadedFiles = [];

  // Load files in order
  for (var i = 0; i < filesToLoad.length; i++) {
    var filePath = filesToLoad[i];

    if (!fs.existsSync(filePath)) {
      continue;
    }

    try {
      var content = fs.readFileSync(filePath, 'utf8');
      var parsed = parseEnvFile(content);

      // Merge parsed values
      Object.keys(parsed).forEach(function(key) {
        // Later files can override earlier ones in cascade mode
        if (!allParsed.hasOwnProperty(key) || cascade) {
          allParsed[key] = parsed[key];
        }
      });

      loadedFiles.push(filePath);
    } catch (err) {
      throw new Error('Failed to load .env file (' + filePath + '): ' + err.message);
    }
  }

  // Set environment variables
  Object.keys(allParsed).forEach(function(key) {
    if (override || !process.env.hasOwnProperty(key)) {
      process.env[key] = allParsed[key];
    }
  });

  // Add metadata about loaded files
  allParsed._loaded = loadedFiles;

  // If watch option is enabled, set up file watchers
  if (options.watch === true) {
    var previousValues = {};
    var watchers = [];
    var isReloading = false;

    // Store current values (exclude metadata)
    Object.keys(allParsed).forEach(function(key) {
      if (key !== '_loaded') {
        previousValues[key] = allParsed[key];
      }
    });

    // Watch each loaded file
    loadedFiles.forEach(function(filePath) {
      try {
        var watcher = fs.watch(filePath, function(eventType) {
          if (eventType === 'change' && !isReloading) {
            isReloading = true;

            // Small delay to ensure file is fully written
            setTimeout(function() {
              try {
                // Reload with override to update existing values
                var reloaded = exports.loadEnv(envPath, Object.assign({}, options, {
                  override: true,
                  watch: false // Prevent recursive watching
                }));

                // Detect what changed
                var changed = {};
                var currentValues = {};

                Object.keys(reloaded).forEach(function(key) {
                  if (key !== '_loaded') {
                    currentValues[key] = reloaded[key];

                    // Check if value changed
                    if (!previousValues.hasOwnProperty(key)) {
                      changed[key] = { type: 'added', value: reloaded[key] };
                    } else if (previousValues[key] !== reloaded[key]) {
                      changed[key] = {
                        type: 'modified',
                        oldValue: previousValues[key],
                        newValue: reloaded[key]
                      };
                    }
                  }
                });

                // Check for removed keys
                Object.keys(previousValues).forEach(function(key) {
                  if (!currentValues.hasOwnProperty(key)) {
                    changed[key] = { type: 'removed', oldValue: previousValues[key] };
                    // Remove from process.env if it was set by us
                    if (process.env[key] === previousValues[key]) {
                      delete process.env[key];
                    }
                  }
                });

                // Update previous values
                previousValues = currentValues;

                // Call onChange callback if there were changes
                if (Object.keys(changed).length > 0 && typeof options.onChange === 'function') {
                  options.onChange(changed, reloaded);
                }

              } catch (err) {
                if (typeof options.onError === 'function') {
                  options.onError(err);
                }
              } finally {
                isReloading = false;
              }
            }, 100);
          }
        });

        watchers.push(watcher);
      } catch (err) {
        // Silently ignore watch errors for individual files
        if (typeof options.onError === 'function') {
          options.onError(new Error('Failed to watch file: ' + filePath));
        }
      }
    });

    // Return unwatch function when watch is enabled
    return function unwatch() {
      watchers.forEach(function(watcher) {
        try {
          watcher.close();
        } catch (err) {
          // Ignore errors when closing watchers
        }
      });
      watchers = [];
    };
  }

  return allParsed;
};



/**
 * Parse .env file content
 *
 * @param {String} content - Content of .env file
 * @return {Object} Parsed key-value pairs
 * @api private
 */

function parseEnvFile(content) {
  const result = {};
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    if (line.startsWith('export ')) {
      line = line.slice(7).trim();
    }

    // Handle multi-line values
    while (line.endsWith('\\') && i < lines.length - 1) {
      line = line.slice(0, -1) + lines[++i].trim();
    }

    const equalsIndex = line.indexOf('=');
    if (equalsIndex === -1) {
      continue;
    }

    const key = line.slice(0, equalsIndex).trim();
    let value = line.slice(equalsIndex + 1).trim();

    // Handle inline comments for unquoted values
    if (!value.startsWith('"') && !value.startsWith("'")) {
      const commentIndex = value.indexOf('#');
      if (commentIndex !== -1) {
        value = value.slice(0, commentIndex).trim();
      }
    }

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
      // Handle escaped characters in a single pass
      value = value.replace(/\\(.)/g, function(match, char) {
        switch (char) {
          case 'n': return '\n';
          case 'r': return '\r';
          case 't': return '\t';
          case '\\': return '\\';
          case '"': return '"';
          case "'": return "'";
          default: return match;
        }
      });
    }

    result[key] = value;
  }

  return result;
}
