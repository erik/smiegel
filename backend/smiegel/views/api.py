import flask
import json

from flask import abort, g, request
from functools import wraps

from smiegel import db, util, publisher
from smiegel.models import User, Message


app = flask.Blueprint('api', __name__)


# API Definitions
# ---------------
# All authenticated requests are wrapped in a signature. The general
# format is as follows:
#
# `{
#    "signature": base64(hmac-sha256(body)),
#    "body": "a string, content varies",
#    "user_id": who is sending this request?
#  }`
#
#
# POST /message/receive
#    {"sender": string, "body": string, "timestamp": int}
#
# POST /message/send
#    {"recipient": string, "body": string, "timestamp": int}
#
# POST /message/ack
#    {"id": int}
#
# ...

REQUIRED_KEYS = ['body', 'signature', 'user_id']


def authentication_required(func):
    """For routes that require messages be authenticated"""
    @wraps(func)
    def decorator(*args, **kwargs):
        json = request.get_json(silent=True)

        if not (json and validate_signature(json)):
            abort(401)

        return func(*args, **kwargs)

    return decorator


# TODO: validate data types
def validate_signature(json):
    if not all([k in json for k in REQUIRED_KEYS]):
        return False

    g.api_user = User.query.get(json['user_id'])
    if not g.api_user:
        return False

    # just ignore all crypto for now
    return json['signature'] == util.authenticate(g.api_user.auth_token,
                                                  json['body'])


def sign_response(message):
    response = {
        'body': message,
        'signature': util.authenticate(g.api_user.auth_token, message)
    }

    return json.dumps(response, indent=4)


@app.route('/contacts', methods=['POST'])
@authentication_required
def contacts():
    contacts = request.get_json()['body']

    g.api_user.contacts = contacts
    db.session.commit()

    event = util.Event('CONTACTS', contacts)
    publisher.publish(g.api_user.id, event)

    return sign_response('sent')


@app.route('/message/receive', methods=['POST'])
@authentication_required
def recv_message():
    event = util.Event('RECEIVED_MSG', request.get_json()['body'])
    publisher.publish(g.api_user.id, event)

    print('hey it worked')
    return sign_response('hey great')


@app.route('/message/send', methods=['POST'])
@authentication_required
def send_message():
    req_msg = request.get_json()['body']
    print('>> sending message: ' + req_msg)

    msg = Message(g.api_user.id, req_msg, acked=False)
    db.session.add(msg)
    db.session.commit()

    print(msg.id)

    # TODO: route to phone

    resp = {'id': str(msg.id)}
    return sign_response(json.dumps(resp))


@app.route('/message/ack', methods=['POST'])
@authentication_required
def ack_message():
    json = request.get_json()['body']
    msg = Message.query.get(json['id'])

    if msg is None:
        abort(404)

    msg.acked = True
    db.session.commit()

    publisher.publish(g.api_user, util.Event('ACKED_MSG', msg.id))

    return sign_response('cool dude')
