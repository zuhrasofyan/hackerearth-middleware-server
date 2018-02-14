/**
 * User_avatar.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    userId: {
      model: 'user',
      unique: true
    },
    avatarUrl: {
      type: 'STRING'
    },
    avatarFd: {
      type: 'STRING'
    },
  },

};

