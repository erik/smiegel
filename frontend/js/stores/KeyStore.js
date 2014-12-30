var Reflux = require('reflux');

var store = require('../vendor/store');
var Crypto = require('../utils/CryptoUtil');

var KeyStore = Reflux.createStore({
  isInitialized: function() {
    return false;
  },

  getShared: function() {
    // TODO: this
  },

  getSecret: function() {
    // TODO: this
  }
});


module.exports = KeyStore;
