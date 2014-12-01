var store = require('../vendor/store');
var humane = require('../vendor/humane');

var CryptoUtil = require('../util/CryptoUtil');


module.exports = {
  // Change this if you want to use some third party server
  API_HOST: '',

  getEventStream: function(cb) {
    var eventSource = new EventSource(this.API_HOST + "/stream");
    eventSource.onmessage = cb;
    eventSource.onerror = function(e) {
      console.log(e);
      humane.log("Failed to reach server!");
    };

    return eventSource;
  },

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
      url: this.API_HOST + endpoint,
      data: JSON.stringify(body),
      dataType: "json"
    });
  }
};
