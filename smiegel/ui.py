import requests
import flask
from flask import render_template, session, request, abort, g, flash

import smiegel.util as util
from smiegel import db

from smiegel.models.user import User

app = flask.Blueprint('ui', __name__, template_folder='templates/',
                      static_folder='static', static_url_path='/content')


def is_new_user(email):
    return User.query.filter_by(login_email=email).first() is None


def create_new_user(email):
    db.session.add(User(email))
    db.session.commit()


@app.before_request
def get_current_user():
    email = session.get('email')

    g.active = False

    if email is not None:
        g.active = True


def load_user(userid):
    return None


@app.route('/')
def index():
    if not g.active:
        return flask.redirect('/login')

    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if g.active:
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
            create_new_user(verification_data['email'])

        user = User.query.filter_by(login_email=verification_data['email']).first()
        flash(str(user.id) + ' ' + util.b64_encode(user.auth_token) + ' ' + user.login_email, 'success')

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
