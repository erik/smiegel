var store = require('../vendor/store');
var forge = require('../vendor/forge').forge;

module.exports = {
  initCrypto: function() {
    // TODO: read from localstorage
  },

  genRandomBytes: function(length) {
    var array = new Uint8Array(length);
    window.crypto.getRandomValues(array);

    return array;
  },

  base64ToArray: function(b64) {
    var raw = window.atob(b64);
    var array = new Uint8Array(new ArrayBuffer(raw.length));

    for (var i in raw) {
      array[i] = raw.charCodeAt(i);
    }

    return array;
  },

  arrayToBase64: function(array) {
    var encoded_str = String.fromCharCode.apply(null, array);
    return window.btoa(encoded_str);
  },

  sign: function(message) {
    return 'TODO: implement sign';
  },

  encrypt: function(message) {
    // TODO: implement encryption
    return JSON.stringify(message);
  },

  decrypt: function(enc) {
    var creds = store.get('creds') || {};

    var iv = window.atob(enc[0]);
    var tag = window.atob(enc[1]);
    var cipher = window.atob(enc[2]);

    var key_bytes = window.atob(creds.shared_key);

    return this._decrypt(key_bytes, iv, tag, cipher);
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

  _decrypt: function(key, iv, tag, cipher) {
    var decipher = forge.cipher.createDecipher('AES-GCM', key);

    decipher.start({
      iv: iv,
      tag: forge.util.createBuffer(tag)
    });

    decipher.update(forge.util.createBuffer(cipher));

    if (decipher.finish()) {
      return decipher.output;
    }

    return null;
  }
};
