/**
 * ImageSaverController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var fs = require('fs');
var secret = sails.config.secret;
var path = require('path');
var SkipperDisk = require('skipper-disk');
var HTTP = require('machinepack-http');

function extractData(dataPrediction, dataImage) {
  // if (data)
  return dataPredictions.predictions[0].probability;
}

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
              // After being saved, send image URL to customvision API to get prediction
              HTTP.post({
                url: 'https://southeastasia.api.cognitive.microsoft.com/customvision/v3.0/Prediction/4e674e11-638c-484a-bad0-33f01830111c/classify/iterations/Iteration1/url',
                data: {
                  url: result.imageUrl
                  // url: 'http://www.dailynews.lk/sites/default/files/news/2016/04/29/bikeaccident.jpg'
                },
                headers: {
                  'Prediction-Key': '91213a714c8849928a84cbf03364b931',
                  'Content-Type': 'application/json'
                }
              }).exec(function(errorPrediction, predictionResult){
                
                if (errorPrediction) {
                  return res.serverError(errorPrediction);
                } else {
                  // TODO: make a function to parse returned json, save the prediction to category, and notify appropiate client
                  if (predictionResult.predictions[0].probability) {
                    if (predictionResult.predictions[0].probability > 0.6) {
                      ImageSaver.update(
                        {id: result.id}, 
                        {category: predictionResult.predictions[0].tagName}
                      ).exec(function(errorUpdate, updateResult){
                        if (errorUpdate) {
                          return res.serverError(errorUpdate);
                        } else {
                          return res.ok(updateResult);
                        }
                      })
                    }
                  }
                  
                  // return res.ok(predictionResult);
                }
              })

            }
          })

        }

      });

    }
  },

  getImage: function (req, res) {

    ImageSaver.findOne({name: req.param('name')}).exec(function(err, image){
      if (err) {return res.negotiate(err);}
      if (!image) {return res.notFound('image cannot be found');}

      // fileAdapter using SkipperDisk
      var fileAdapter = SkipperDisk(/* optional opts */);

      // Stream the file down
      fileAdapter.read(image.imageFd)
        .on('error', function (err){
          return res.serverError(err);
        })
        .pipe(res);
    });
  },

  getAllImage: function (req, res) {
    ImageSaver.find().exec(function(err, result) {
      if (err) {
        return res.negotiate(err);
      } else {
        return res.json(result);
      }
    })
  }

};

