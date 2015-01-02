var React = require('react');

var Settings = require('../components/Settings.react');


var Navbar = React.createClass({
  _openSettingsPane: function() {
    React.render(<Settings />, document.getElementById('modal'));
  },

  render: function() {
    return (
      <nav className="navbar navbar-default navbar-static-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand">Smiegel</a>
          </div>
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
            </ul>

            <ul className="nav navbar-nav navbar-right">
              <li className="dropdown">
                <a className="dropdown-toggle"
                   data-toggle="dropdown"
                   role="button"
                   aria-expanded="false">

                  <span className="glyphicon glyphicon-cog" aria-hidden="true" />
                  <span className="caret" />
                </a>
                <ul className="dropdown-menu" role="menu">
                  <li><a onClick={this._openSettingsPane}>Settings</a></li>
                  <li className="divider"></li>
                  <li><a>Sign out</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});


module.exports = Navbar;
