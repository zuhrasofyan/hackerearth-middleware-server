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

    });

    //res.send({message: 'TODO: register User'});
  },

  // enable to show all user
  getAllUser: function (req, res) {
    User.find().exec(function (err, result){
      if (err) {
        return res.serverError();
      } else if (!result) {
        return res.notFound(undefined);
      } else {
        return res.json(result);
      }
    });
  },

  getUser: function(req, res) {
    var userId = req.param('id');
    User.findOne(userId).exec(function(err, result){
      if (err) {
        return res.serverError();
      } else if (!result) {
        return res.notFound();
      } else {
        return res.json(result);
      }
    })
  },

  // Upload user avatar
  uploadAvatar: function (req, res) {
    var userId = req.param('id');
    var filename = req.file('avatar')._files[0].stream.filename;

    //extract extension
    var extension = filename.substr(filename.lastIndexOf('.')+1).toLowerCase().toString();

    // if extension of uploaded image is not jpg or png, response with error
    if ((extension != "jpg") && (extension != "jpeg") && (extension != "png")) {
      return res.badRequest('Format gambar yang dibolehkan adalah jpeg, jpg atau png');
    } else {

      // Avatar uploaded
      req.file('avatar').upload({
        // max size: ~2 MB
        maxBytes: 2000000,
        // set custom upload dir path name. Put it outside main folder to avoid accidentally deleted asset folder when update/clone repo
        dirname: path.resolve(sails.config.appPath, '../tapal-assets/images/avatar')
      }, function whenDone(err, uploadedFiles){
        // TODO: Make a random friendly string filename to prevent user uploaded file with unicode filename.
        var fileNameAfterUpload = uploadedFiles[0].fd;
        // Use path library to get the UUID name of uploaded file
        // console.log(path.basename(uploadedFiles[0].fd));
        if (err) {
          return res.negotiate(err);
        }

        // if no file uploaded, response with error
        if (uploadedFiles.length === 0) {
          return res.badRequest('Tidak ada file yang diupload');
        } else {
          // Before upload new avatar, check if user ever upload an avatar
          User_avatar.findOne({userId: userId}).exec(function(err, userav){

            // If existed, delete file from server then Update User_avatar
            if (userav) {
              fs.stat(userav.avatarFd, function (err, result){
                if (err) {
                  return res.serverError(err);
                } else {
                  fs.unlink(userav.avatarFd, function (err, res){
                    if (err) {
                      return res.serverError(err);
                      // console.log(err);
                    } else {
                      console.log('file dihapus!');
                    }
                  })
                }
              });

              // Then Save the 'fd' and the url to User_avatar table where avatar for a user can be accessed
              User_avatar.update({userId: userId}, {
                // Generate a unique URL where the avatar can be downloaded.
                avatarUrl: require('util').format('%s/user/avatar/%s', sails.config.appUrl, userId),

                // Grab the first file and use it's `fd` (file descriptor)
                avatarFd: uploadedFiles[0].fd
              })
                .exec(function(err){
                  if (err) {
                    return res.negotiate(err);
                  } else {
                    return res.ok('Berkas '+ filename + ' telah berhasil diunggah!' + extension);
                  }
                })
            // ELSE if the first time user upload avatar, just save it and save URL&Fd to User_avatar model
            } else {
              User_avatar.create({
                userId: userId,
                avatarUrl: require('util').format('%s/user/avatar/%s', sails.config.appUrl, userId),
                avatarFd: uploadedFiles[0].fd
              })
                .exec(function(err, result){
                  if (err) {
                    return res.serverError(err);
                  } else {
                    return res.ok('avatar pertama anda berhasil disimpan');
                  }
                })
            }
          });
        }

      });

    }
  },

};

