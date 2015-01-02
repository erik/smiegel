var React = require('react');

var ChatInput       = require('../components/ChatInput.react');
var ChatMessageList = require('../components/ChatMessageList.react');

var ChatStore    = require('../stores/ChatStore.js');
var ContactStore = require('../stores/ContactStore.js');

var APIUtil = require('../utils/APIUtil.js');


var ContactList = React.createClass({
  getInitialState: function() {
    return this._getStateFromStores();
  },

  componentDidMount: function () {
    var that = this;

    $('#contact-list').modal('show');
    $('#contact-list').on('hidden.bs.modal', function () {
      that._onClose();
    });
  },

  componentWillUnmount: function () {
  },

  render: function () {
    var contacts = this.state.contacts.map(this._renderContact);

    return (
      <div id="contact-list" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h3 className="modal-title">Contacts</h3>
            </div>

            <div className="modal-body">
              <p>
                <div className="input-group input-group-lg" id="contact-search">
                  <span className="input-group-addon glyphicon glyphicon-search"
                        aria-hidden="true"
                        id="search-span" />
                  <input type="text"
                         ref="contactSearch"
                         className="form-control typeahead"
                         placeholder="Find contact."
                         onKeyUp={this._updateSearch}
                         aria-describedby="search-span" />
                </div>
              </p>

              <p>
                <div className="contact-list-group list-group">
                  { contacts }
                </div>
              </p>
            </div>
            <div className="modal-footer">
               <span className="badge">{ contacts.length }</span> found.
            </div>
          </div>
        </div>
      </div>
    );
  },

  _getStateFromStores: function(query) {
    return {
      contacts: ContactStore.getAllMatching(query || '')
    };
  },

  _selectContactOnClick: function(contact, number) {
    var that = this;
    return function() { that._selectContact(contact, number); };
  },

  _selectContact: function(contact, number) {
    ChatStore.addChat(number, contact.name);
    ChatStore.setCurrentId(number);

    $('#contact-list').modal('hide');
  },

  _renderContact: function(contact) {
    var that = this;
    var numbers = contact.numbers.map(function(n) {
      return (
          <p className="list-group-item-text"
             onClick={that._selectContactOnClick(contact, n.number)}>
            <em>{ n.type }</em> — { n.number }
          </p>
      );
    });

    return (
      <a href="#"
         key={ contact.name + contact.numbers }
         className="list-group-item">
        <h4 className="list-group-item-heading"> { contact.name } </h4>
        { numbers }
      </a>
    );
  },

  _updateSearch: function() {
    var query = this.refs.contactSearch.getDOMNode().value;
    this.setState(this._getStateFromStores(query));
  },

  _onClose: function() {
    React.unmountComponentAtNode(document.getElementById('modal'));
  }
});

module.exports = ContactList;
