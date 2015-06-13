/*!
 * morgan
 * Copyright(c) 2013 TJ Holowaychuk
 * Copyright(c) 2014 Jonathan Ong
 * MIT Licensed
 */

/**
 * Parse the Authorization header field of `req`.
 *
 * @param {object} req
 * @return {object} with .name and .pass
 * @public
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
  auth = auth.match(/^([^:]*):(.*)$/);
  if (!auth) return;

  return { name: auth[1], pass: auth[2] };
};
