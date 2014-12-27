var React = require('react');

var ChatMessageList = require('../components/ChatMessageList.react');
var ChatInput = require('../components/ChatInput.react');
var ChatList = require('../components/ChatList.react');

var APIUtil = require('../util/APIUtil.js');

var App = React.createClass({
    componentWillMount: function () {
        this.listen();
    },

    render: function() {
        return (
            <div className="app">
              <div className="col-sm-3" id="chat-list">
                  <ChatList />
              </div>
              <div className="col-sm-9">
                <ChatMessageList />
                <ChatInput />
              </div>
            </div>
        );
    },

    listen: function () {
        var eventSource;

        return function() {
            if (eventSource) { eventSource.close(); }
            eventSource = APIUtil.getEventStream();
        }
    }()
});


module.exports = App;
