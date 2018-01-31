/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var EmailAddresses = require('machinepack-emailaddresses');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var secret = sails.config.secret;
var path = require('path');

module.exports = {
    register: function (req, res) {
        var email = req.param('email');
        var password = req.param('password');

        //validate request
        if (_.isUndefined(req.param('email'))) {  
            return res.badRequest('Dibutuhkan alamat email untuk mendaftar!');  
        }
        if (_.isUndefined(req.param('password'))) {
            return res.badRequest('Dibutuhkan password untuk mendaftar!');
        }
        if (req.param('password').length < 6) {
            return res.badRequest('Password harus terdiri dari minimal 6 karakter!')
        }
        EmailAddresses.validate({
            string: email
        }).exec({
            error : function (err) {
                return res.serverError(err);
            },
            invalid: function () {
                return res.badRequest('Sepertinya yang anda masukkan bukan dalam format email yang benar :)');
            },
            success : function () {
                User.findOne({email:email}).exec(function (err, result){
                    //validate from database
                    if (err) {
                        return res.serverError(err);
                    } else if (result) {
                        return res.badRequest('Email sudah terdaftar!');
                    } else {
                        
                        User.create({username:email, email:email, password:password}).exec(function (err, result){
                            if (err) {
                                return res.serverError(err);
                                //return res.badRequest('Error create user');
                            }
                            return res.ok();
                        })
                    }
                });
            }

        })


        
        //res.send({message: 'TODO: register User'});
    }
};

