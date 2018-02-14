/**
 * isCorrectUserId
 *
 * @module      :: Policy
 * @description :: Simple policy to check user id (the header id should be the same with id coming from req, useful e.g. to scope-modifying his/her own user information)
 *
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
var jwt = require('jsonwebtoken');
var secret = sails.config.secret;

module.exports = function(req, res, next) {


  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  var userId = req.param('id');

  var decoded = jwt.verify(req.headers.authorization.split(' ')[1], secret);
  if (decoded) {
    // Check if result from decoded token user id is equal to requested url param with userId
    if (decoded.id == userId) {
      return next();
    } else {return res.forbidden('Operasi yang anda lakukan dilarang!')};
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  // return res.forbidden('You are not permitted to perform this action.');
  return res.notFound('User tidak dapat di autentifikasi');
};
