var ChatApp = require('./components/ChatApp.react.js');
var React = require('react');
window.React = React;

React.render(
    <ChatApp />,
    document.getElementById('react')
);
