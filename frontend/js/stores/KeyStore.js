var EventDispatcher = require('../dispatcher/EventDispatcher');
var EventConstants = require('../constants/EventConstants');

var EventEmitter = require('events').EventEmitter;;
var assign = require('object-assign');
var store = require('../vendor/store');

var ActionTypes = EventConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var KeyStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getShared: function() {
    // TODO: this
  },

  getSecret: function() {
    // TODO: this
  }
});

KeyStore.dispatchToken = EventDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {
    default: {
      // do nothing
    }
  }
});


module.exports = KeyStore;
