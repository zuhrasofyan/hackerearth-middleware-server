/**
 * Passport configuration file where you should configure strategies
 */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var JwtStrategy = require('passport-jwt').Strategy;
var bcrypt = require('bcrypt-nodejs');

passport.use(new LocalStrategy({
        // by default, passport use username and password field as input. I prefer to use authenticate by email address field,
        // thus change the default usernameField to 'email'.
        usernameField: 'email'
    },
    function(email, password, done) {
        User.find({email:email}).exec(function(err, user) {

            if (err) {
                return done(null, err);
            }
            if (!user || user.length < 1) {
                return done(null, false, {
                    message: 'Incorrect User'
                });
            }

            bcrypt.compare(password, user[0].password, function(err, res) {
                if (err || !res) {
                    return done(null, false, {
                        message: 'Invalid Password'
                    });
                } else {
                    return done(null,user);
                }
            });
        });
    })
);

module.exports = {
    http: {
        customMiddleware: function(app) {
            app.use(passport.initialize());
            app.use(passport.session());
        }
    }
};