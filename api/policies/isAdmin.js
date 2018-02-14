/**
 * isAdmin
 *
 * @module      :: Policy
 * @description :: Simple policy to check user role if admin
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
var jwt = require('jsonwebtoken');
var secret = sails.config.secret;

module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller

  var decoded = jwt.verify(req.headers.authorization.split(' ')[1], secret);
  if (decoded) {
    console.log(decoded);

    if (decoded.isAdmin === true) {
      return next();
    } else {return res.forbidden('Anda Bukan Admin!')};
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  //return res.forbidden('You are not permitted to perform this action.');
  return res.notFound('Tidak dapat mengautentifikasi user anda');
};
