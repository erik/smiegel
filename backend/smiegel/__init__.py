import flask

from flask.ext.sqlalchemy import SQLAlchemy
from smiegel.publisher import Publisher

app = flask.Flask(__name__)
db = SQLAlchemy(app)
publisher = Publisher()

from smiegel.views import ui, api

app.register_blueprint(api.app, url_prefix='/api')
app.register_blueprint(ui.app, static_path='/static')
