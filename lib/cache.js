const cache = {};  // Simple in-memory object

function cacheMiddleware(req, res, next) {
  if (req.method !== 'GET') return next();

  const key = req.originalUrl;
  const now = Date.now();

  // Check if response exists and not expired
  if (cache[key] && cache[key].expiry > now) {
    return res.send(cache[key].data);  // Serve cached response
  }

  // Override res.send to store response in cache
  const originalSend = res.send.bind(res);
  res.send = (body) => {
    cache[key] = {
      data: body,
      expiry: now + 5000  // 5 seconds TTL
    };
    originalSend(body);
  };

  next();
}

module.exports = cacheMiddleware;
