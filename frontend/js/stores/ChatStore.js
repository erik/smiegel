var store = require('../vendor/store');
var Reflux = require('reflux');

var APIUtil = require('../utils/APIUtil');
var ChatAction = require('../actions/ChatAction');
var MessageStore = require('../stores/MessageStore');

var _currentId = null;

var ChatStore = Reflux.createStore({
  init: function() {
    this.listenTo(ChatAction.receiveMessage, this._receiveMessage);

    if (!store.get('threads')) {
      store.set('threads', {});
    }
  },

  addChat: function(id, name) {
    var threads = store.get('threads');

    if (!(id in threads)) {
      threads[id] = {
        'id': id,
        'name': name,
        'unread': 0
      };

      store.set('threads', threads);
    }
  },

  getAll: function() {
    var threads = store.get('threads');

    return Object.keys(threads).map(function(k) {
      return threads[k];
    });
  },

  setCurrentId: function(id) {
    _currentId = id;

    var threads = store.get('threads');
    threads[_currentId].unread = 0;

    store.set('threads', threads);

    this.trigger();
    MessageStore.trigger();
  },

  getCurrentId: function() {
    return _currentId;
  },

  _receiveMessage: function(message) {
    this.addChat(message.author, message.author);

    if (message.author != _currentId) {
      var threads = store.get('threads');
      threads[message.author].unread += 1;
      store.set('threads', threads);
    }

    message.thread = message.author;
    message.acked = true;

    MessageStore.addMessage(message);

    this.trigger();
  }
});

module.exports = ChatStore;
