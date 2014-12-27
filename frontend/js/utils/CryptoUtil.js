var forge = require('../vendor/forge');

module.exports = {
  SECRET_KEY: null,
  SHARED_KEY: null,

  initCrypto: function() {
    // TODO: read from localstorage
  },

  genRandomBytes: function(length) {
    var array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    return array;
  },

  sign: function(message) {
    return 'TODO: implement sign';
  },

  encrypt: function(message) {
    // TODO: implement encryption
    return JSON.stringify(message);
  },

  _encrypt: function(key, msgBytes) {
    var cipher = forge.cipher.createCipher('AES-GCM', key);
    var iv = this.genRandomBytes(16);

    cipher.start({
      iv: iv,
      tagLength: 128
    });

    cipher.update(forge.util.createBuffer(msgBytes));
    cipher.finish();

    var encrypted = cipher.output;
    var tag = cipher.mode.tag;

    // TODO: this
  },

  _decrypt: function(key, msgBytes) {
    var iv = msgBytes.slice(0, 16);
    var tag = msgBytes.slice(16, 32);
    var encrypted = msgBytes.slice(32);

    var decipher = forge.cipher.createDecipher('AES-GCM', key);

    decipher.start({
      iv: iv,
      tagLength: 128,
      tag: tag
    });

    decipher.update(encrypted);

    if (decipher.finish()) {
      return decipher.output;
    }

    return null;
  }
};
