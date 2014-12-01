var store = require('../vendor/store');
var Reflux = require('reflux');

var ActionTypes = require('../constants/EventConstants').ActionTypes;
var APIUtil = require('../util/APIUtil');
var ChatAction = require('../action/ChatAction');


var MessageStore = Reflux.createStore({
  init: function() {
    this.listenTo(ChatAction.receiveMessage, this._receiveMessage);
    this.listenTo(ChatAction.createMessage, this._createMessage);
  },

  addMessage: function(message) {
    var msgs = store.get('messages') || [];
    msgs.push(message);

    store.set('messages', msgs);
  },

  formatCreatedMessage: function(message) {
    var timestamp = Date.now();

    return {
      id: 'm_' + timestamp,
      author: 'me',
      sender: 'self',
      timestamp: new Date(timestamp),
      text: message
    }
  },

  getAll: function() {
    return store.get('messages') || [];
  },

  _receiveMessage: function(message) {
    this.addMessage(message);
    this.trigger();
  },

  _createMessage: function(text) {
    var message = this.formatCreatedMessage(text);

    this.addMessage(message);

    APIUtil.sendMessage(message);
    this.trigger();
  }
});


module.exports = MessageStore;
