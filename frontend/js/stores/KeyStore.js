var Reflux = require('reflux');

var store = require('../vendor/store');
var Crypto = require('../utils/CryptoUtil');

var KeyStore = Reflux.createStore({
  isInitialized: function() {
    var creds = this.getCredentials();

    return !!creds.isInitialized;
  },

  clearCredentials: function() {
    store.set('creds', { isInitialized: false });
  },

  getCredentials: function() {
    return store.get('creds') || {};
  },

  setCredentials: function(creds) {
    var oldCreds = this.getCredentials();

    $.extend(oldCreds, creds);
    oldCreds.isInitialized = true;

    // TODO: check all properties exist

    store.set('creds', oldCreds);
    this.trigger();
  },

  getToken: function() {
    var tok = this.getCredentials().auth_token;
    return window.atob(tok);
  },

  getSecret: function() {
    var sec = this.getCredentials().shared_key;
    return window.atob(sec);
  },

  getUserId: function() {
    return this.getCredentials().user_id;
  }
});


module.exports = KeyStore;
