var EventDispatcher = require('../dispatcher/EventDispatcher');
var EventConstants = require('../constants/EventConstants');

var EventEmitter = require('events').EventEmitter;;
var assign = require('object-assign');

var ActionTypes = EventConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var MessageStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  get: function(id) {
    // TODO: this
  },

  getAll: function() {
    // TODO: this
  }
});

MessageStore.dispatchToken = EventDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {
    case ActionTypes.RECEIVE_MSG: {
      // TODO: this
      MessageStore.emitChange();
      break;
    }

    default: {
      // do nothing
    }
  }
});


module.exports = MessageStore;
