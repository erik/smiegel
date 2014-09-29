import requests
import flask
from flask import Flask, render_template, session, request, abort, g, redirect, url_for, flash
from flask.ext.login import login_user, login_required

from smiegel import get_db, query_db

app = flask.Blueprint('ui', __name__, template_folder='templates/',
                      static_folder='static', static_url_path='/content')


def is_new_user(email):
    user = query_db('SELECT * FROM users WHERE email = ?',
                    [email], single=True)

    return user is None


def get_messages(email, limit=30):
    return query_db('SELECT * FROM messages WHERE email = ? LIMIT ?',
                    [email, limit])

def get_chat_names(email):
    return query_db('SELECT DISTINCT(recipient), MAX(timestamp) FROM messages WHERE email = ? ORDER BY 2 desc',
                    [email])

@app.before_request
def get_current_user():
    g.user = None
    email = session.get('email')

    if email is not None:
        g.user = email


def load_user(userid):
    return None


@app.route('/')
def index():
    cur = get_db().cursor()

    if not g.user:
        return flask.redirect('/login')

    return render_template('index.html', msgs=get_messages(g.user))


@app.route('/login', methods=['GET', 'POST'])
def login():

    if g.user is not None:
        return flask.redirect('/')

    return render_template('login.html')


@app.route('/_auth/login', methods=["GET", "POST"])
def login_handler():
    resp = requests.post(flask.current_app.config['PERSONA_VERIFIER'], data={
        'assertion': request.form['assertion'],
        'audience': request.host_url
    }, verify=True)

    if not resp.ok:
        flash("Don't you try to spoof me", 'error')
        abort(400)

    verification_data = resp.json()

    if verification_data['status'] == 'okay':
        if is_new_user(verification_data['email']):
            abort(400)

        session['email'] = verification_data['email']
        flash('You logged in', 'success')
        return 'okay'


@app.route('/_auth/logout', methods=["GET", "POST"])
def logout_handler():
    session.clear()

    flash('You logged out', 'success')

    return flask.redirect('/login')


@app.route('/subscribe')
def sub():
    pass
