var store = require('../vendor/store');
var Reflux = require('reflux');

var ActionTypes = require('../constants/EventConstants').ActionTypes;
var APIUtil = require('../util/APIUtil');
var ChatAction = require('../action/ChatAction');


var MessageStore = Reflux.createStore({
  init: function() {
    this.listenTo(ChatAction.ackMessage, this._ackMessage);
    this.listenTo(ChatAction.receiveMessage, this._receiveMessage);
    this.listenTo(ChatAction.createMessage, this._createMessage);
    this.listenTo(ChatAction.updateMessageId, this._updateMessageId);
  },

  addMessage: function(message) {
    var msgs = store.get('messages') || [];
    msgs.push(message);

    store.set('messages', msgs);
  },

  formatCreatedMessage: function(message) {
    var timestamp = Date.now();

    return {
      id: 'tmp_' + timestamp,
      author: 'me',
      sender: 'self',
      timestamp: new Date(timestamp),
      acked: false,
      text: message
    }
  },

  getAll: function() {
    return store.get('messages') || [];
  },

  _ackMessage: function(id) {
    var msgs = store.get('messages') || [];

    msgs = msgs.map(function(msg) {
      if (msg.id == id) {
        msg.acked = true;
      }

      return msg;
    });

    store.set('messages', msgs);
    this.trigger();
  },

  _createMessage: function(text) {
    var message = this.formatCreatedMessage(text);

    this.addMessage(message);

    APIUtil.sendMessage(message);
    this.trigger();
  },

  _receiveMessage: function(message) {
    this.addMessage(message);
    this.trigger();
  },

  _updateMessageId: function(oldId, newId) {
    var msgs = store.get('messages') || [];

    msgs = msgs.map(function(msg) {
      if (msg['id'] == oldId) {
        msg['id'] = newId;
      }

      return msg;
    });

    store.set('messages', msgs);
    this.trigger();
  }
});


module.exports = MessageStore;
