var React = require('react');

var EventDispatcher = require('../dispatcher/EventDispatcher');
var EventAction = require('../action/EventAction');
var ChatMessageList = require('../components/ChatMessageList.react');

var App = React.createClass({
    componentWillMount: function () {
        this.listen();
    },

    render: function() {
        return (
            <div className="app">
              <ChatMessageList />
            </div>
        );
    },

    listen: function () {
        var eventSource;

        return function() {
            if (eventSource) { eventSource.close(); }

            eventSource = new EventSource("/stream");
            eventSource.onmessage = EventAction.receiveEvent;
        }
    }()
});


module.exports = App;
