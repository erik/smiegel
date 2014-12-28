var store = require('../vendor/store');
var Reflux = require('reflux');

var APIUtil = require('../utils/APIUtil');
var ChatAction = require('../actions/ChatAction');
var ContactStore = Reflux.createStore({
  init: function() {
    var contacts = [
      {'name': '7890789A B'   , 'number': '888123423123'},
      {'name': 'A 2342B'      , 'number': '88823123'},
      {'name': 'A 3456B0'     , 'number': '88823121233'},
      {'name': 'A 563456B'    , 'number': '88234823123'},
      {'name': 'A 56B'        , 'number': '88822343123'},
      {'name': 'A B'          , 'number': '88823121233'},
      {'name': 'A23 B'        , 'number': '88823122133'},
      {'name': 'A 234B'       , 'number': '88823123'},
      {'name': 'A2 B'         , 'number': '88823123423'},
      {'name': 'A 53B'        , 'number': '8882312343'},
      {'name': 'A B'          , 'number': '888231423423423423'},
      {'name': 'A6 B'         , 'number': '8882316523'},
      {'name': 'A B'          , 'number': '88823167892233'},
      {'name': 'A54 B'        , 'number': '888231678923'},
      {'name': 'A 6B5'        , 'number': '8882318923'},
      {'name': 'A B;jkl;j'    , 'number': '88823423123'},
      {'name': 'A Basdfasdf'  , 'number': '84523458823123'},
      {'name': 'A Basdfasdf'  , 'number': '88823123'},
      {'name': 'A asd3fB'     , 'number': '88823123'},
      {'name': 'A asdf2B'     , 'number': '88823123'},
      {'name': 'A asdsfasdfB' , 'number': '888231457623'},
      {'name': 'A asdfsasdfB' , 'number': '88823123'},
      {'name': 'A asdfasdfB'  , 'number': '8882312453'},
      {'name': 'A asdfa1sdfB' , 'number': '888231253'},
      {'name': 'A asdfsadB'   , 'number': '88823184623'},
      {'name': 'A cB'         , 'number': '8882312457663'},
      {'name': 'A dB'         , 'number': '8882312456789763'},
      {'name': 'A eB'         , 'number': '888231245673'},
      {'name': 'A ewerrB'     , 'number': '88823123'},
      {'name': 'A fB'         , 'number': '888231245763'},
      {'name': 'A gB'         , 'number': '8882312456673'},
      {'name': 'A jkl;jkl;B'  , 'number': '88823123'},
      {'name': 'A xcvbxcvbB'  , 'number': '88823123'},
      {'name': 'Aasdfasd B'   , 'number': '88823123'},
      {'name': 'Aasdfasdf B'  , 'number': '8882317623'},
      {'name': 'Asadfasdf B'  , 'number': '88823123'},
      {'name': 'asdfasdA B'   , 'number': '888234567123'},
      {'name': 'asdfasdfA B'  , 'number': '88827698345123'}
    ];

    if (!store.get('contacts')) {
      store.set('contacts', contacts);
    }
  },

  getAll: function() {
    return store.get('contacts') || [];
  },

  getAllMatching: function(query) {
    console.log(query);
    console.log('"' + query + '"');
    if (query.trim() == '') {
      return this.getAll();
    }

    var contacts = this.getAll();
    var matches = [];

    query = query.toLowerCase();

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
