var React = require('react');

var ChatMessageList = require('../components/ChatMessageList.react');
var ChatInput = require('../components/ChatInput.react');
var ChatList = require('../components/ChatList.react');

var APIUtil = require('../utils/APIUtil.js');

var App = React.createClass({
    componentWillMount: function () {
        this.listen();
    },

    render: function() {
        return (
          <div className="app">
            <nav className="navbar navbar-default navbar-static-top">
              <div className="container-fluid">
                <div className="navbar-header">
                  <a className="navbar-brand" href="#">Smiegel</a>
                </div>
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul className="nav navbar-nav">
                  </ul>

                  <ul className="nav navbar-nav navbar-right">
                    <li className="dropdown">
                      <a href="#" className="dropdown-toggle"
                                  data-toggle="dropdown"
                                  role="button"
                                  aria-expanded="false">Dropdown <span className="caret"></span>
                      </a>
                      <ul className="dropdown-menu" role="menu">
                        <li className="divider"></li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>

            <div className="row">
              <div className="col-sm-3" id="chat-list">
                  <ChatList />
              </div>
              <div className="col-sm-9">
                <ChatMessageList />
                <ChatInput />
              </div>
            </div>
          </div>
        );
    },

    listen: function () {
        var eventSource;

        return function() {
            if (eventSource) { eventSource.close(); }
            eventSource = APIUtil.getEventStream();
        }
    }()
});


module.exports = App;
