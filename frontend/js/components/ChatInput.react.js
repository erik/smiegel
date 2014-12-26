var React = require('react');
var ChatAction = require('../action/ChatAction');


var ChatInput = React.createClass({
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
      return (
        <div className="inputbox">
                <form onSubmit={this._onSubmit}>
                  <input type="text"
                         ref="text"
                         className="text-field"
                         placeholder="Say something" />
                  <input onClick={this._onSubmit}
                         type="button"
                         className="button postfix"
                         value="Submit" />
                </form>
          </div>
        );
    }
});


module.exports = ChatInput;
