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

  _encrypt: function(key, msg) {
    var iv = this.genRandomBytes(16);

    // TODO: this
  },

  _decrypt: function(key, msg) {
    var iv = msg.slice(0, 16);
    var tag = msg.slice(16, 32);
    var encrypted = msg.slice(32);

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
