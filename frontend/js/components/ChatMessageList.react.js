var React = require('react');

var EventDispatcher = require('../dispatcher/EventDispatcher');
var EventAction = require('../action/EventAction');
var ChatMessage = require ('../components/ChatMessage.react');
var MessageStore = require('../stores/MessageStore');


var ChatMessageList = React.createClass({
    getInitialState: function() {
        return this._getStateFromStores();
    },

    componentDidMount: function() {
        this._updateUI();

        MessageStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        MessageStore.removeChangeListener(this._onChange);
    },

    componentDidUpdate: function() {
        this._updateUI();
    },

    render: function() {
        var messages = this.state.messages.map(this._getChatMessage);

        return (
            <div className="chatwindow" ref="chatWindow">
              <div className="messagewindow" ref="messageList">
                {messages}
              </div>
            </div>
        );
    },

    _getStateFromStores: function() {
        return {
            messages: MessageStore.getAll()
        };
    },

    _onChange: function() {
        this.setState(this._getStateFromStores());
    },

    _updateUI: function() {
        // TODO: import jquery like a sane person
        $("abbr.timeago").timeago();


        this._scrollToBottom();
    },

    _scrollToBottom: function() {
        var ul = this.refs.messageList.getDOMNode();
        ul.scrollTop = ul.scrollHeight;
    },

    _getChatMessage: function(message) {
        return (
            <ChatMessage key={message.id} message={message} />
        );
    }
});


module.exports = ChatMessageList;
