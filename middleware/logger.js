// middleware/logger.js
module.exports = function(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
};
