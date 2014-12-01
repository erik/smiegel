var EventDispatcher = require('../dispatcher/EventDispatcher');
var EventConstants = require('../constants/EventConstants');
var APIUtil = require('../util/APIUtil');
var MessageStore = require('../stores/MessageStore');

var ActionTypes = EventConstants.ActionTypes;

module.exports = {
  createMessage: function(msg) {
    EventDispatcher.handleViewAction({
      type: ActionTypes.CREATE_MESSAGE,
      message: msg
    });

    var message = MessageStore.getCreatedMessageData(msg);
    APIUtil.sendMessage(message);
  }

};
