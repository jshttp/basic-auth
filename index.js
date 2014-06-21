
/**
 * Parse the Authorization header field of `req`.
 *
 * @param {Request} req
 * @return {Object} with .name and .pass
 * @api public
 */

module.exports = function(req){
  req = req.req || req;

  var auth = req.headers.authorization;
  if (!auth) return;

  // malformed
  var parts = auth.split(' ');
  if ('basic' != parts[0].toLowerCase()) return;
  if (!parts[1]) return;
  auth = parts[1];

  // credentials
  auth = new Buffer(auth, 'base64').toString();
  auth = auth.match(/^([^:]+):(.+)$/);
  if (!auth) return;

  return { name: auth[1], pass: auth[2] };
};

module.exports.header = function(name, pass){
  var seperator = pass ? ':' : '';

  pass = pass || '';

  return 'Basic ' + new Buffer(name + seperator + pass).toString('base64');
};
