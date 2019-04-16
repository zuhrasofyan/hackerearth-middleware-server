/**
 * ImageSaver.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

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
    }

  },

};

