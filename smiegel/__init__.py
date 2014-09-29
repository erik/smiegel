import sqlite3
from flask import g, current_app


def get_db():
    db = getattr(g, '_database', None)

    if db is None:
        db = g._database = sqlite3.connect(':memory:')

        with current_app.open_resource('schema.sql', 'r') as f:
            db.cursor().executescript(f.read())
        db.commit()

    return db


def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


def query_db(query, args=(), single=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if single else rv
