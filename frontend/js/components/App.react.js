var React = require('react');

var ChatMessageList = require('../components/ChatMessageList.react');
var ChatInput = require('../components/ChatInput.react');
var APIUtil = require('../util/APIUtil.js');

var App = React.createClass({
    componentWillMount: function () {
        this.listen();
    },

    render: function() {
        return (
            <div className="app">
              <ChatMessageList />
              <ChatInput />
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
