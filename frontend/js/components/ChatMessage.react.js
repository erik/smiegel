var React = require('react');

var EventDispatcher = require('../dispatcher/EventDispatcher');
var EventAction = require('../action/EventAction');


var ChatMessage = React.createClass({
    render: function() {
        var message = this.props.message;
        var senderClass = 'sender-' + message.sender;

        return (
            <div className={"message " + senderClass}>
              <div className="message-author-name">{message.author}
                <abbr className="timeago" title={new Date(message.timestamp).toISOString()}>
                </abbr>
              </div>
              <div className="text">{message.text}</div>
            </div>
        );
    }
});


module.exports = ChatMessage;
