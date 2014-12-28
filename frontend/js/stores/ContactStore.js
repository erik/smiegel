var store = require('../vendor/store');
var Reflux = require('reflux');

var APIUtil = require('../utils/APIUtil');
var ChatAction = require('../actions/ChatAction');
var ContactStore = Reflux.createStore({
  init: function() {
    if (!store.get('contacts')) {
      store.set('contacts', []);
    }
  },

  getAll: function() {
    var contacts = store.get('contacts') || [];
    contacts.sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });

    return contacts;
  },

  getAllMatching: function(query) {
    query = query.toLowerCase();

    if (query.trim() == '') {
      return this.getAll();
    }

    var contacts = this.getAll();
    var matches = [];

    for (var idx in contacts) {
      var contact = contacts[idx];

      if ( contact.name.toLowerCase().indexOf(query) != -1
        || contact.number.indexOf(query) != -1) {
        matches.push(contact);
      }
    }

    return matches;
  }
});

module.exports = ContactStore;
