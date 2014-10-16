import flask

from flask.ext.sqlalchemy import SQLAlchemy

app = flask.Flask(__name__)

app.config.update(
    DEBUG=True,
    SECRET_KEY='my development key1',
    PERSONA_JS='https://login.persona.org/include.js',
    PERSONA_VERIFIER='https://verifier.login.persona.org/verify',
    SQLALCHEMY_DATABASE_URI='sqlite:///:memory:'
)


db = SQLAlchemy(app)

from smiegel import ui, api

app.register_blueprint(api.app, url_prefix='/api')
app.register_blueprint(ui.app, static_path='/static')
