from flask import Flask
from smiegel import ui, api, close_connection

if __name__ == '__main__':
    app = Flask(__name__)
    app.register_blueprint(api.app)
    app.register_blueprint(ui.app, static_path='/static')

    app.config.update(
        DEBUG=True,
        SECRET_KEY='my development key1',
        PERSONA_JS='https://login.persona.org/include.js',
        PERSONA_VERIFIER='https://verifier.login.persona.org/verify',
    )

    app.teardown_appcontext(close_connection)

    app.run()
