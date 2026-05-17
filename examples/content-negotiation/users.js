// hello
/**
 * HTTP handler that returns a simple HTML unordered list of user names.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object used to send the HTML.
 * @returns {void} Sends an HTML string containing a <ul> with each user's name as an <li>.
 */
exports.html = function(req, res){
  res.send('<ul>' + users.map(function(user){
    return '<li>' + user.name + '</li>';
  }).join('') + '</ul>');
};