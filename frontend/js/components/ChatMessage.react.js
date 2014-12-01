var React = require('react');

var EventDispatcher = require('../dispatcher/EventDispatcher');
var EventAction = require('../action/EventAction');


var ChatMessage = React.createClass({
    render: function() {
        var message = this.props.message;

        return (
            <div className="message">
              <h5 className="message-author-name">{message.author}</h5>
              <abbr className="timeago" title={new Date(message.timestamp).toISOString()}>
              </abbr>

              <div className="text">{message.text}</div>
            </div>
        );
    }
});


module.exports = ChatMessage;
