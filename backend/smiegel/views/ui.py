import requests
import flask
import json
import queue

from flask import render_template, session, request, abort, g, flash

import smiegel.util as util

from smiegel import db, publisher
from smiegel.models import User


app = flask.Blueprint('ui', __name__, template_folder='templates/',
                      static_folder='static', static_url_path='/assets')


def create_new_user(email):
    user = User(email)
    db.session.add(user)
    db.session.commit()

    return user


@app.before_request
def get_current_login():
    uid = session.get('user_id')

    if uid:
        g.user = User.query.get(uid)
    else:
        g.user = None


@app.route('/')
def index():
    if not g.user:
        return flask.redirect('/login')

    return render_template('index.html')


@app.route('/stream', methods=['GET'])
def event_stream():
    if not g.user:
        abort(401)

    uid = g.user.id
    q = queue.Queue()

    # Push credential information first
    q.put(util.Event('CREDENTIALS', json.dumps({
        'user_id': str(uid),
        'auth_token': util.b64_encode(g.user.auth_token),
        'email': g.user.login_email
    })))

    # Push contacts list
    q.put(util.Event('CONTACTS', g.user.contacts or {}))

    def sse_stream():
        try:
            publisher.subscribe(uid, q)

            while True:
                yield q.get().encodeSse()

        except GeneratorExit:
            publisher.unsubscribe(uid, q)

    return flask.Response(sse_stream(),
                          mimetype='text/event-stream')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if g.user:
        return flask.redirect('/')

    return render_template('login.html', user=g.user)


@app.route('/_auth/login', methods=["GET", "POST"])
def login_handler():
    resp = requests.post(flask.current_app.config['PERSONA_VERIFIER'], data={
        'assertion': request.form['assertion'],
        'audience': request.host_url
    }, verify=True)

    data = resp.json()

    if not resp.ok or data['status'] != 'okay':
        flash("Don't you try to spoof me", 'error')
        abort(401)

    user = User.query.filter_by(login_email=data['email']).first()

    if user is None:
        user = create_new_user(data['email'])
        flash('Welcome to Smiegel!', 'success')

    if not user:
        abort(500)

    flash(str(user.id) + ' ' + util.b64_encode(user.auth_token) + ' ' + user.login_email, 'success')

    session['user_id'] = user.id

    flash('You logged in', 'success')
    return flask.jsonify({'status': 'okay'})


@app.route('/_auth/logout', methods=["GET", "POST"])
def logout_handler():
    session.clear()

    flash('You logged out', 'success')

    return flask.redirect('/')
