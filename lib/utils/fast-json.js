/*!
 * express - fast json serialization
 * Copyright(c) 2025
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 * @private
 */

var fastJsonStringify;
try {
  fastJsonStringify = require("fast-json-stringify");
} catch (e) {
  // fast-json-stringify not installed, will use native JSON.stringify
  fastJsonStringify = null;
}

/**
 * Schema cache to avoid recompilation
 * @private
 */

var schemaCache = new Map();

/**
 * Get or create a fast JSON serializer for a schema
 *
 * @param {Object} schema - JSON schema for serialization
 * @return {Function|null} Serializer function or null
 * @private
 */

function getSerializer(schema) {
  if (!schema || !fastJsonStringify) {
    return null;
  }

  var key = JSON.stringify(schema);

  if (!schemaCache.has(key)) {
    try {
      var serializer = fastJsonStringify(schema);
      schemaCache.set(key, serializer);
    } catch (err) {
      // Invalid schema, return null to fallback
      return null;
    }
  }

  return schemaCache.get(key);
}

/**
 * Stringify with optional fast serialization
 *
 * BACKWARD COMPATIBLE: Falls back to JSON.stringify if:
 * - No schema provided
 * - fast-json-stringify not installed
 * - Schema is invalid
 * - Serialization fails
 *
 * @param {*} value - Value to serialize
 * @param {Function} [replacer] - Replacer function
 * @param {Number|String} [space] - Indentation
 * @param {Boolean} [escape] - Escape HTML chars
 * @param {Object} [schema] - Optional JSON schema for fast serialization
 * @return {String} JSON string
 * @public
 */

function stringify(value, replacer, space, escape, schema) {
  var json;

  // Use fast serialization if schema provided and available
  if (schema && !replacer && !space) {
    var serializer = getSerializer(schema);
    if (serializer) {
      try {
        json = serializer(value);
        return escape ? escapeJson(json) : json;
      } catch (err) {
        // Fallback to native on error
      }
    }
  }

  // Fallback to native JSON.stringify (backward compatible)
  json = JSON.stringify(value, replacer, space);

  return escape ? escapeJson(json) : json;
}

/**
 * Escape special characters for JSON
 *
 * @param {String} json
 * @return {String}
 * @private
 */

function escapeJson(json) {
  return json.replace(/[<>&]/g, function (c) {
    switch (c) {
      case "<":
        return "\\u003c";
      case ">":
        return "\\u003e";
      case "&":
        return "\\u0026";
      default:
        return c;
    }
  });
}

/**
 * Clear schema cache
 * @public
 */

function clearCache() {
  schemaCache.clear();
}

/**
 * Get cache statistics
 * @return {Object}
 * @public
 */

function getCacheStats() {
  return {
    size: schemaCache.size,
    available: !!fastJsonStringify,
  };
}

/**
 * Module exports.
 * @public
 */

exports.stringify = stringify;
exports.clearCache = clearCache;
exports.getCacheStats = getCacheStats;
