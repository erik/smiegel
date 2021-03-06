var humane = require('../vendor/humane');

var ChatAction = require('../actions/ChatAction');
var EventTypes = require('../constants/EventConstants').EventTypes;

var ContactStore = require('../stores/ContactStore');
var KeyStore     = require('../stores/KeyStore');

var CryptoUtil = require('../utils/CryptoUtil');


module.exports = {
  // Change this if you want to use some third party server
  API_HOST: '',

  getEventStream: function() {
    var source = new EventSource(this.API_HOST + "/stream");

    source.addEventListener(EventTypes.CONTACTS, this._eventRecvContacts);
    source.addEventListener(EventTypes.CREDENTIALS, this._eventRecvCreds);
    source.addEventListener(EventTypes.RECEIVED_MSG, this._eventRecvMsg);
    source.addEventListener(EventTypes.ACKED_MSG, this._eventAcked);

    source.onerror = function(e) {
      console.log(e);
      humane.log("Failed to reach server!");
    };

    return source;
  },

  sendMessage: function(message) {
    this._postData(
      '/api/message/send',
      this.formatRequest(1, JSON.stringify(message)),
      function(response) {
        var js = JSON.parse(response);
        ChatAction.updateMessageId(message.id, js.id);
      }
    );
  },

  formatRequest: function(user_id, body) {
    var encrypted = JSON.stringify(CryptoUtil.encrypt(body));
    var signature = CryptoUtil.sign(encrypted);

    var msg = {
      'user_id': KeyStore.getUserId(),
      'body': encrypted,
      'signature': signature
    };

    return msg;
  },

  _postData: function(endpoint, body, cb) {
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: this.API_HOST + endpoint,
      data: JSON.stringify(body),
      dataType: "json",
    }).done(function(data) {
      if (cb) {
        cb(data.body);
      }
    });
  },

  _eventAcked: function(eventData) {
    // TODO: decrypt message here
    var msg = JSON.parse(eventData.data);

    ChatAction.ackMessage(msg.id);
  },

  _eventRecvContacts: function(eventData) {
    var encrypted = JSON.parse(eventData.data);
    var decrypted = CryptoUtil.decrypt(encrypted);

    if (decrypted === null) {
      humane.log('Failed to decrypt contact list...');
      return;
    }

    humane.log('Received most recent contacts list');

    ContactStore.setContacts(JSON.parse(decrypted));
  },

  _eventRecvMsg: function(eventData) {
    var encrypted = JSON.parse(eventData.data);
    var decrypted = CryptoUtil.decrypt(encrypted);

    if (decrypted === null) {
      humane.log('Failed to decrypt message received...');
      return;
    }

    var msg = JSON.parse(decrypted);

    // TODO: more message receive-y things
    msg.sender = msg.sender || 'other';

    ChatAction.receiveMessage(msg);
  },

  _eventRecvCreds: function(eventData) {
    var creds = JSON.parse(eventData.data);
    humane.log('Received credentials for ' + creds.email);

    var storedCreds = KeyStore.getCredentials();
    $.extend(storedCreds, creds);
    KeyStore.setCredentials(storedCreds);
  }
};
