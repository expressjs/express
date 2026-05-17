/**
 * Express handler that responds with an HTML unordered list of user names.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object used to send the HTML.
 * @returns {void}
 */
exports.html = function(req, res){
  res.send('<ul>' + users.map(function(user){
    return '<li>' + user.name + '</li>';
  }).join('') + '</ul>');
};