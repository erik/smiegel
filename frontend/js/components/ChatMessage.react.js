var React = require('react');

var EventDispatcher = require('../dispatcher/EventDispatcher');
var EventAction = require('../action/EventAction');


var ChatMessage = React.createClass({
    render: function() {
        var message = this.props.message;

        return (
            <div className="message">
              <b className="message-author-name">{message.author}</b>
              <div className="message-time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>

              <div className="message-text">{message.text}</div>
            </div>
        );
    }
});


module.exports = ChatMessage;
