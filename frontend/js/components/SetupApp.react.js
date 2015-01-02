var React  = require('react');
var Reflux = require('reflux');

var KeyStore = require('../stores/KeyStore');

var APIUtil    = require('../utils/APIUtil');
var CryptoUtil = require('../utils/CryptoUtil');


var SetupApp = React.createClass({
  mixins: [Reflux.ListenerMixin],

  componentWillMount: function () {
    this._listen();
    this.listenTo(KeyStore, this._updateQr);
  },

  componentDidMount: function() {
    this._regenerate('secret_key')();
  },

  _renderSecret: function(ref, name) {
    return (
      <p key={ref}>
        <div className="input-group">
          <div className="input-group-btn">
            <button type="button"
                    className="btn btn-default dropdown-toggle"
                    data-toggle="dropdown"
                    aria-expanded="false">
              { name }
              <span className="caret" />
            </button>
            <ul className="dropdown-menu" role="menu">
              <li>
                <a onClick={this._regenerate(ref)}>
                  Regenerate { name }
                </a>
              </li>
            </ul>
          </div>
          <input ref={ref}
                 onChange={this._updateQr}
                 type="text"
                 className="form-control" />
        </div>
      </p>
    );
  },

  render: function() {
    return (
      <div className="app row">
        <div className="col-sm-12">
          <div className="page-header">
            <h1>hey lets go ahead and set this up. <small>yeah bro</small></h1>
          </div>

          <h2>Step 0. Install the app. <small>Which doesnt exist yet sorry.</small></h2>
          <a href="https://github.com/erik/smiegel-android">
            <img alt="Get it on Google Play"
                 src="https://developer.android.com/images/brand/en_generic_rgb_wo_60.png" />
          </a>

          <h2>Step 1. Make sure Im not evil. <small>Or dont see if I care</small></h2>
          <p> If you have an existing configuration somewhere copy paste the values in here</p>

          { this._renderSecret('secret_key', 'Secret Key') }

          <h2>Step 2. Scan the QR Code <small>With the app, dummy</small></h2>
          <div className="well">
            <div id="qrcode" />
          </div>
       </div>
      </div>
    );
  },

  _regenerate: function(ref) {
    var that = this;

    return function() {
      var key = CryptoUtil.genRandomBytes(32);
      var key_b64 = CryptoUtil.arrayToBase64(key);

      that.refs[ref].getDOMNode().value = key_b64;

      var creds = KeyStore.getCredentials();

      KeyStore.setCredentials({ shared_key: key_b64 });
    };
  },

  _updateQr: function() {
    var creds = KeyStore.getCredentials();

    $.extend(creds, {
      'server': window.location.origin
    });

    $('#qrcode').empty();
    $('#qrcode').qrcode(JSON.stringify(creds));
  },

  _listen: function () {
    var eventSource;

    return function() {
      if (eventSource) { eventSource.close(); }
      eventSource = APIUtil.getEventStream();
    };
  }()

});


module.exports = SetupApp;
