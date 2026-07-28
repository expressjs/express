'use strict';

const { AsyncLocalStorage } = require('async_hooks');
const { randomUUID } = require('crypto');

const als = new AsyncLocalStorage();

function requestContext (options) {
  options = options || {};
  const header = String(options.header || 'x-request-id').toLowerCase();

  return function requestContextMiddleware (req, res, next) {
    const incoming = req.get && req.get(header);
    const rid = incoming || (typeof randomUUID === 'function' ? randomUUID() : Math.random().toString(36).slice(2));

    // minimal store object per request
    const store = { id: rid };

    // convenient accessors
    Object.defineProperty(req, 'requestId', {
      configurable: true,
      enumerable: false,
      get: function () { return rid; }
    });

    if (typeof req.getContext !== 'function') {
      req.getContext = function () { return als.getStore(); };
    }

    als.run(store, next);
  };
}

requestContext.getStore = function () {
  return als.getStore();
};

module.exports = requestContext;
