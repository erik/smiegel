var React = require('react');
var Reflux = require('reflux');

var ContactList = require('../components/ContactList.react');
var ChatStore = require('../stores/ChatStore');

var ChatItem = React.createClass({
  onClick: function() {
    ChatStore.setCurrentId(this.props.chat.id);
  },

  render: function() {
    var chat = this.props.chat;

    var cls = "list-group-item";
    if (chat.id == ChatStore.getCurrentId()) {
      cls += " active";
    }

    var unread = '';
    if (chat.unread > 0) {
      unread = <span className="badge"> { chat.unread } </span>;
    }

    return (
      <a onClick={this.onClick}
         className={ cls }>
        { chat.name }
        { unread }
      </a>
    );
  }
});

var ChatList = React.createClass({
  mixins: [Reflux.ListenerMixin],

  getInitialState: function() {
    return this._getStateFromStores();
  },

  componentDidMount: function() {
    this.listenTo(ChatStore, this._onChange);
  },

  componentDidUpdate: function() {},

  render: function() {
    var chats = this.state.chats.map(this._getChat);

    return (
      <div className="chat-list">
        <div className="list-group">
          <a onClick={this._openContactList}
             href="#"
             className="list-group-item">
            <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
            Start conversation
          </a>

          { chats }
        </div>
      </div>
    );
  },

  _getChat: function(chat) {
    return <ChatItem key={ chat.id } chat={ chat } />;
  },

  _getStateFromStores: function() {
    return {
      chats: ChatStore.getAll()
    };
  },

  _openContactList: function() {
    React.render(<ContactList />, document.getElementById('modal'));

  },

  _onChange: function() {
    this.setState(this._getStateFromStores());
  }
});


module.exports = ChatList;
