var React = require('react');

var ChatMessageList = require('../components/ChatMessageList.react');
var ChatInput = require('../components/ChatInput.react');
var ChatList = require('../components/ChatList.react');

var Settings = React.createClass({
  componentDidMount: function () {
    var that = this;

    $('#settings').modal('show');
    $('#settings').on('hidden.bs.modal', function () {
      that._onClose();
    });
  },

  render: function() {
    return (
      <div id="settings" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h3 className="modal-title">Settings</h3>
            </div>

            <div className="modal-body">
              <p>
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  },

  _onClose: function() {
    React.unmountComponentAtNode(document.getElementById('modal'));
  }
});


module.exports = Settings;
