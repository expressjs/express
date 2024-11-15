/*!
 * rateLimit
 * Copyright(c) 2024 Ali Bagheri
 * MIT Licensed
 */

'use strict';

/**
 * Rate limiting middleware for Express.js
 *
 * @param {Object} options
 * @param {number} options.ttl - Time frame for which requests are checked/remembered in milliseconds
 * @param {number} options.max - Maximum number of requests allowed per `ttl`
 * @param {any} [options.message] - Message sent when rate limit is exceeded
 * @return {Function} Middleware function to use in Express.js
 * @public
 */

module.exports = function rateLimit(options) {
  if (!options || typeof options !== 'object') {
    throw new TypeError('RateLimit options must be an object');
  }

  const { ttl, max, message } = options;

  if (typeof ttl !== 'number' || ttl <= 0) {
    throw new TypeError('RateLimit `ttl` must be a positive number');
  }

  if (typeof max !== 'number' || max <= 0) {
    throw new TypeError('RateLimit `max` must be a positive number');
  }

  const requests = new Map();

  return function rateLimitMiddleware(req, res, next) {
    const ip = req.ip;
    const now = Date.now();

    let requestData = requests.get(ip);

    if (!requestData || now - requestData.lastRequest > ttl) {
      // Initialize or reset the data
      requestData = { count: 0, lastRequest: now };
      requests.set(ip, requestData);
    }

    requestData.count++;
    requestData.lastRequest = now;

    if (requestData.count > max) {
      res.status(429).send(message || 'Too many requests.');
      return;
    }

    next();
  };
};
