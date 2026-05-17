/**
 * Sends an HTML unordered list of user names.
 *
 * @param {Object} req Express request object (unused).
 * @param {Object} res Express response object used to send the HTML.
 */
exports.html = function(req, res) {
  res.send('<ul>' + users.map(function(user) {
    return '<li>' + user.name + '</li>';
  }).join('') + '</ul>');
};

/**
 * Sends a plain‑text list of user names, each prefixed with a dash.
 *
 * @param {Object} req Express request object (unused).
 * @param {Object} res Express response object used to send the text.
 */
exports.text = function(req, res) {
  res.send(users.map(function(user) {
    return ' - ' + user.name + '\n';
  }).join(''));
};