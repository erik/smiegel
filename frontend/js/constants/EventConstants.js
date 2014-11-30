var keyMirror = require('keymirror');

module.exports = {
  ActionTypes: keyMirror({
    SEND_MESSAGE: null,
    RECEIVE_MSG: null
  }),

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })

};
