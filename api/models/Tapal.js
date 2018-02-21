/**
 * Tapal.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    nama: {
      type: 'STRING'
    },
    userId: {
      model: 'user'
    },
    tapalUrl: {
      type: 'STRING'
    },
    tapalFd: {
      type: 'STRING'
    },
    kategori: {
      type: 'STRING'
    },
    sumber: {
      type: 'STRING'
    },
    isActive: {
      type: 'BOOLEAN',
      defaultsTo: true
    },
    isProtected: {
      type: 'BOOLEAN',
      defaultsTo: false
    },
    informasi: {
      type: 'STRING'
    },
    thumbnailUrl: {
      type: 'STRING'
    },
    thumbnailFd: {
      type: 'STRING'
    },
    toJSON: function () {
      var obj = this.toObject();
      //this will delete doc tapal location address keyvalue from returned json
      delete obj.tapalFd;
      delete ob.thumbnailFd;
      // delete obj.avatarFd;
      // delete obj.avatarUrl;
      return obj;
    },
  },

};

