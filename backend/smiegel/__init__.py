import flask

from flask.ext.sqlalchemy import SQLAlchemy
from smiegel.publisher import Publisher

app = flask.Flask(__name__)

app.config.update(
    DEBUG=True,
    SECRET_KEY='my development key1',
    PERSONA_JS='https://login.persona.org/include.js',
    PERSONA_VERIFIER='https://verifier.login.persona.org/verify',
    SQLALCHEMY_DATABASE_URI='sqlite:///:memory:'
)


db = SQLAlchemy(app)

publisher = Publisher()

from smiegel.views import ui, api

app.register_blueprint(api.app, url_prefix='/api')
app.register_blueprint(ui.app, static_path='/static')