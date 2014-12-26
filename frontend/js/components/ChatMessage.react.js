var React = require('react');

var ChatMessage = React.createClass({
  render: function() {
    var message = this.props.message;
    var senderCls = 'sender-' + message.sender;
    var ackedCls = message.acked ? 'acked' : 'unacked';

    return (
      <div className={['message', ackedCls, senderCls].join(' ')}>
        <div className="message-author-name">{message.author}
          <abbr className="timeago" title={new Date(message.timestamp).toISOString()}>
          </abbr>
        </div>

        { message.acked ?  '' : <div className="loader">...</div> }

        <div className="text"> { message.text } </div>
      </div>
    );
  }
});


module.exports = ChatMessage;
