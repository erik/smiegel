var React = require('react');

var EventDispatcher = require('../dispatcher/EventDispatcher');
var EventAction = require('../action/EventAction');


var ChatApp = React.createClass({
    componentWillMount: function () {
        this.listen();
    },

    render: function() {
        return (
            <div className="chatapp">
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


module.exports = ChatApp;
