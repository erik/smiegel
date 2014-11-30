var App = require('./components/App.react.js');
var React = require('react');
window.React = React;

React.render(
    <App />,
    document.getElementById('react')
);
