// Helper middleware to send 405 Method Not Allowed and set Allow header
function methodNotAllowedCatcher(req, res) {
  if (req.route && req.route.stack) {
    // Collect allowed methods from the route stack
    const allowed = req.route.stack
      .map((layer) => layer.method && layer.method.toUpperCase())
      .filter(Boolean);
    if (allowed.length > 0) {
      res.set("Allow", allowed.join(", "));
    }
  }
  res.sendStatus(405);
}

module.exports = methodNotAllowedCatcher;
