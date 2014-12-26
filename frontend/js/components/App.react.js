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
              <div className="col-sm-3">
                  Chat list will go here.
              </div>
              <div className="col-sm-8">
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
