var EventDispatcher = require('../dispatcher/EventDispatcher');
var EventConstants = require('../constants/EventConstants');
var CryptoUtil = require('../util/CryptoUtil');

var ActionTypes = EventConstants.ActionTypes;

module.exports = {
  receiveEvent: function(message) {
    var json = JSON.parse(message.data);

    switch (json.event) {
      case "RECEIVED_MSG": {
        // TODO: decrypt message here

        var msg = JSON.parse(json.data);
        msg.sender = 'other';

        console.log('received ' + msg);

        EventDispatcher.handleServerAction({
          type: ActionTypes.RECEIVE_MSG,
          message: msg
        });

        break;
      }

      default: {
        console.log("unknown event!");
        console.log(json);
        break;
      }
    }
  },

  receiveAll: function(rawMessages) {
    EventDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_RAW_MESSAGES,
      rawMessages: rawMessages
    });
  },

  receiveCreatedMessage: function(createdMessage) {
    EventDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_RAW_CREATED_MESSAGE,
      rawMessage: createdMessage
    });
  }
};
