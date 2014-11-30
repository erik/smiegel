from flask import Flask

from smiegel import app, db


if __name__ == '__main__':
    import eventlet
    from eventlet import wsgi

    app.config.update(
        DEBUG=True,
        SECRET_KEY='my development key1',
        PERSONA_JS='https://login.persona.org/include.js',
        PERSONA_VERIFIER='https://verifier.login.persona.org/verify',
        SQLALCHEMY_DATABASE_URI='sqlite:////tmp/tmp.db'
    )

    db.create_all()
    app.run('0.0.0.0', threaded=True)
