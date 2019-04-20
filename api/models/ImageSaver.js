/**
 * ImageSaver.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {

    name: {
      type: 'STRING'
    },
    category: {
      type: 'STRING'
    },
    lat: {
      type: 'FLOAT'
    },
    lon: {
      type: 'FLOAT'
    },
    imageFd: {
      type: 'STRING'
    },
    imageUrl: {
      type: 'STRING'
    },
    toJSON: function () {
      var obj = this.toObject();
      //this will delete doc imagefd location address keyvalue from returned json
      delete obj.imageFd;
      return obj;
    },

  },

};

