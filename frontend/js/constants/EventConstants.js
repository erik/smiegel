var keyMirror = require('keymirror');

module.exports = {
  ActionTypes: keyMirror({
    SEND_MESSAGE: null,
    CREATE_MESSAGE: null,
    RECEIVE_MSG: null
  }),

  EventTypes: {
    RECEIVED_MSG: "RECEIVED_MSG"
  },

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })

};
