var store = require('../vendor/store');
var Reflux = require('reflux');

var APIUtil = require('../util/APIUtil');
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
    var threads = store.get('threads');

    if (!(message.author in threads)) {
      threads[message.author] = {
        'id': message.author,
        'name': message.author,
        'unread': 0
      };
    }

    if (message.author != _currentId) {
      threads[message.author].unread += 1;
    }

    message.thread = message.author;
    message.acked = true;

    store.set('threads', threads);
    MessageStore.addMessage(message);

    this.trigger();
  }
});

module.exports = ChatStore;
