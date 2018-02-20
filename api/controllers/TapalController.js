/**
 * TapalController
 *
 * @description :: Server-side actions for handling incoming requests that related with tapal.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var fs = require('fs');
var path = require('path');
var SkipperDisk = require('skipper-disk');
var crypto = require('crypto');

module.exports = {

  // Upload user avatar
  uploadTapal: function (req, res) {
    var userId = req.param('id'),
        kategori = req.param('kategori'),
        sumber = req.param('sumber'),
        isProtected = req.param('isProtected'),
        informasi = req.param('informasi');
    var filename = req.file('tapal')._files[0].stream.filename;
    var nama = filename;

    //extract extension
    var extension = filename.substr(filename.lastIndexOf('.')+1).toLowerCase().toString();

    // if extension of uploaded image is not jpg or png, response with error
    if (extension != "pdf") {
      return res.badRequest('Format gambar yang dibolehkan adalah pdf');
    } else {

      // Tapal uploaded
      req.file('tapal').upload({
        // no max size
        // maxBytes: 2000000,
        // set custom upload dir path name. Put it outside main folder to avoid accidentally deleted asset folder when update/clone repo
        dirname: path.resolve(sails.config.appPath, '../tapal-assets/docs/tapal')
      }, function whenDone(err, uploadedFiles) {
        // TODO: Make a random friendly string filename to prevent user uploaded file with unicode filename.
        var randomUrl = crypto.randomBytes(20).toString('hex');
        // Use path library to get the UUID name of uploaded file
        // console.log(path.basename(uploadedFiles[0].fd));
        if (err) {
          return res.negotiate(err);
        }

        // if no file uploaded, response with error
        if (uploadedFiles.length === 0) {
          return res.badRequest('Tidak ada file yang diupload');
        } else {
          // save informations from incoming post req to database table tapal.
          // CAUTION! in frontend, the uploaded file must be put in the last order after other params, otherwise, params return undefined
          Tapal.create({
            nama: nama,
            userId: userId,
            kategori: kategori,
            sumber: sumber,
            isProtected: isProtected,
            tapalUrl: require('util').format('%s/docs/tapal/%s', sails.config.appUrl, randomUrl),
            tapalFd: uploadedFiles[0].fd,
            informasi: informasi
          })
            .exec(function (err, result) {
              if (err) {
                return res.serverError(err);
              } else {
                return res.ok('Dokumen anda berhasil disimpan');
              }
            });
        }
      });
    }
  },


};

