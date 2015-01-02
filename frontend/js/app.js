var React = require('react');
window.React = React;

var App      = require('./components/App.react');
var SetupApp = require('./components/SetupApp.react');

var KeyStore = require('./stores/KeyStore');


var app = KeyStore.isInitialized() ? <App /> : <SetupApp />;
React.render(app, document.getElementById('react'));
