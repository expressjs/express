/*!
 * express - LRU cache utility
 * Copyright(c) 2025
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

var LRUCache;
try {
  var lruModule = require('lru-cache');
  // Handle both CJS and ESM exports
  LRUCache = lruModule.LRUCache || lruModule.default || lruModule;
} catch (e) {
  // lru-cache not installed, use simple Map fallback
  LRUCache = null;
}

/**
 * Create an LRU cache with fallback to Map
 *
 * @param {Object} options - Cache options
 * @return {Object} Cache instance
 * @public
 */

function createCache(options) {
  options = options || {};

  if (LRUCache) {
    // Use LRU cache with eviction
    return new LRUCache({
      max: options.max || 1000,
      ttl: options.ttl || 1000 * 60 * 60, // 1 hour default
      updateAgeOnGet: false,
      updateAgeOnHas: false
    });
  }

  // Fallback to simple Map (no eviction)
  var cache = new Map();
  var maxSize = options.max || 1000;

  return {
    get: function(key) {
      return cache.get(key);
    },
    set: function(key, value) {
      if (cache.size >= maxSize) {
        // Simple FIFO eviction
        var firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      cache.set(key, value);
      return this;
    },
    has: function(key) {
      return cache.has(key);
    },
    delete: function(key) {
      return cache.delete(key);
    },
    clear: function() {
      cache.clear();
    },
    get size() {
      return cache.size;
    }
  };
}

/**
 * Module exports.
 * @public
 */

module.exports = {
  createCache: createCache
};
