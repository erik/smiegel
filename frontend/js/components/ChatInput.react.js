var React = require('react');
var Reflux = require('reflux');

var ChatAction = require('../action/ChatAction');
var ChatStore = require('../stores/ChatStore');

var ChatInput = React.createClass({
  mixins: [Reflux.ListenerMixin],

  getInitialState: function() {
    return { active: this._haveActiveChat() };
  },

  componentDidMount: function() {
    this.listenTo(ChatStore, this._onChange);
  },

  _haveActiveChat: function() {
    return ChatStore.getCurrentId() != null;
  },

  _onChange: function() {
    this.setState({ active: this._haveActiveChat() });
  },

  _onSubmit: function(e) {
    e.preventDefault();
    var msg = this.refs.text.getDOMNode().value.trim();

    // Do nothing on blank messages.
    if (msg === '') {
      return;
    }

   ChatAction.createMessage(msg);
   this.refs.text.getDOMNode().value = '';
  },

  render: function() {
    if (!this.state.active) {
      return (
        <div className="inputbox">
        <form>
          <input disabled
                 type="text"
                 className="text-field form-control"
                 aria-describedby="basic-addon2"
                 placeholder="Choose or create a chat" />
          </form>
        </div>
      );
    }

    return (
      <div className="inputbox">
        <form onSubmit={this._onSubmit}>
          <input autofocus
                 type="text"
                 ref="text"
                 className="text-field form-control"
                 aria-describedby="basic-addon2"
                 placeholder="Say something" />
        </form>
      </div>
    );
  }
});


module.exports = ChatInput;
