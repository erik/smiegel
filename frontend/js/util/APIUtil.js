var store = require('../vendor/store');

var CryptoUtil = require('../util/CryptoUtil');


module.exports = {
  sendMessage: function(message) {
    this._postData('/api/message/send', this.formatRequest(1, message));
  },

  formatRequest: function(user_id, body) {
    var signature = CryptoUtil.sign(body);
    var encrypted = CryptoUtil.encrypt(body);

    var msg = {
        'user_id': this._getCredentials().user_id,
        'body': encrypted,
        'signature': signature
    };

    return msg;
  },

  _getCredentials: function() {
    // TODO: write this for real.
    return {
      user_id: 1,
      shared_key: null,
      secret_key: null
    }
  },

  _postData: function(endpoint, body) {
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: endpoint,
      data: JSON.stringify(body),
      dataType: "json"
    });
  }
};
