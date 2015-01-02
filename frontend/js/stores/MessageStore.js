var Reflux = require('reflux');

var ChatAction = require('../actions/ChatAction');
var APIUtil = require('../utils/APIUtil');

var store = require('../vendor/store');


var MessageStore = Reflux.createStore({
  init: function() {
    this.listenTo(ChatAction.ackMessage, this._ackMessage);
    this.listenTo(ChatAction.createMessage, this._createMessage);
    this.listenTo(ChatAction.updateMessageId, this._updateMessageId);
  },

  addMessage: function(message) {
    var msgs = store.get('messages') || [];
    msgs.push(message);

    store.set('messages', msgs);
    this.trigger();
  },

  formatCreatedMessage: function(message) {
    var ChatStore = require('../stores/ChatStore');
    var timestamp = Date.now();

    return {
      id: 'tmp_' + timestamp,
      author: 'me',
      sender: 'self',
      timestamp: new Date(timestamp),
      acked: false,
      thread: ChatStore.getCurrentId(),
      text: message
    };
  },

  getAll: function() {
    return store.get('messages') || [];
  },

  getAllForChat: function(chatId) {
    var messages = store.get('messages') || [];

    return messages.filter(function(msg) {
      return msg.thread === chatId;
    });
  },

  _ackMessage: function(id) {
    var msgs = store.get('messages') || [];

    msgs = msgs.map(function(msg) {
      if (msg.id === id) {
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

  _updateMessageId: function(oldId, newId) {
    var msgs = store.get('messages') || [];

    msgs = msgs.map(function(msg) {
      if (msg.id === oldId) {
        msg.id = newId;
      }

      return msg;
    });

    store.set('messages', msgs);
    this.trigger();
  }
});


module.exports = MessageStore;
