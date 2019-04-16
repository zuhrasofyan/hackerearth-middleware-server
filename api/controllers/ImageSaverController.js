/**
 * ImageSaverController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var fs = require('fs');
var secret = sails.config.secret;
var path = require('path');
// var crypto = require('crypto');
var SkipperDisk = require('skipper-disk');

module.exports = {
  
  // save image and pass data to azure CV
  uploadImage: function (req, res) {
    var lat = req.param('lat');
    var lon = req.param('lon');
    var filename = req.file('image')._files[0].stream.filename;

    //extract extension
    var extension = filename.substr(filename.lastIndexOf('.')+1).toLowerCase().toString();

    // if extension of uploaded image is not jpg or png, response with error
    if ((extension != "jpg") && (extension != "jpeg") && (extension != "png")) {
      return res.badRequest('only image allowed!');
    } else {

      // Avatar uploaded
      req.file('image').upload({
        // no maxBytes
        // maxBytes: 10000000,
        // set custom upload dir path name. Put it outside main folder to avoid accidentally deleted asset folder when update/clone repo
        dirname: path.resolve(sails.config.appPath, '../customvision/images')
      }, function whenDone(err, uploadedFiles){
        
        // var fileNameAfterUpload = uploadedFiles[0].fd;
        // Use path library to get the UUID name of uploaded file
        // console.log(path.basename(uploadedFiles[0].fd));
        if (err) {
          return res.negotiate(err);
        }

        // if no file uploaded, response with error
        if (uploadedFiles.length === 0) {
          return res.badRequest('no file being uploaded');
        } else {
             
          ImageSaver.create({
            name: path.basename(uploadedFiles[0].fd),
            lat: lat,
            lon: lon,
            imageUrl: require('util').format('%s/customvision/image/%s', sails.config.appUrl, path.basename(uploadedFiles[0].fd)),
            imageFd: uploadedFiles[0].fd
          })
          .exec(function(err, result){
            if (err) {
              return res.serverError(err);
            } else {
              // TODO: not res.ok, but instead send image to cv API and retrieve information from it, save to category in db
              return res.ok('your image has been saved');

            }
          })

        }

      });

    }
  },

};

