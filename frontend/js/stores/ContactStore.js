var Reflux = require('reflux');
var store = require('../vendor/store');


var ContactStore = Reflux.createStore({
  init: function() {
    if (!store.get('contacts')) {
      store.set('contacts', []);
    }
  },

  setContacts: function(contacts) {
    store.set('contacts', contacts);
    this.trigger();
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

    if (query.trim() === '') {
      return this.getAll();
    }

    var contacts = this.getAll();
    var matches = [];

    for (var i in contacts) {
      var contact = contacts[i];

      if (contact.name.toLowerCase().indexOf(query) !== -1) {
        matches.push(contact);
      } else {
        for (var j in contact.numbers) {
          if (contact.numbers[j].number.indexOf(query) !== -1) {
            matches.push(contact);
            break;
          }
        }
      }
    }

    return matches;
  }
});

module.exports = ContactStore;
