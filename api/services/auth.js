var passport = require('passport');
var jwt = require('jsonwebtoken');
//var User =

module.exports = {
    login: function (req, res) {
        passport.authenticate('local', function (err, user) {
            if (!user) {
                res.status(400).send({
                    success: false,
                    message: 'Password atau email yang anda masukkan salah. coba ulangi'
                });
                return;
            } else {
                if (err) {
                    res.status(400).send({
                        success: false,
                        message: 'Server error',
                        error: err
                    });
                } else {
                    // Delete user password from returned token
                    var userData = user[0];
                    delete userData.password;
                    // token expired in 7 days
                    var token = jwt.sign(userData, sails.config.secret, {expiresIn: 60 * 60 * 24 * 7});
                    // Set persistent cookie
                    req.session.cookie.token = token;
                    res.send({
                        success: true,
                        user: user[0],
                        token: token
                    });
                }
            }
        })(req, res);
    },
    isvalidtoken: function (req, res) {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization.replace('Bearer ', ''), sails.config.secret, function (err, decoded) {
                //418 = I'm a teapot!
                if (err) return res.status(401).send({success: false, message: 'invalid'});
                if (decoded) {
                    return res.send({success: true, user: decoded});
                }
            });
        } else {
            return res.status(401).send({success: false, message: 'token invalid'});
        }
    }
};
