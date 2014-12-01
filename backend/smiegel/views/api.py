import flask
import json

from flask import abort, g, request
from functools import wraps

from smiegel import util, publisher
from smiegel.models import User


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
#    [{"sender": string, "body": string, "timestamp": int}, ...]
#
# POST /message/send
#    {"recipient": string, "body": string, "timestamp": int}
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
    return True
    return json['signature'] == util.authenticate(g.api_user.auth_token,
                                                  json['body'])


def sign_response(message):
    response = {
        'body': message,
        'signature': util.authenticate(g.api_user.auth_token, message)
    }

    return json.dumps(response, indent=4)


@app.route('/message/receive', methods=['POST'])
@authentication_required
def recv_message():
    msgs = json.loads(request.get_json()['body'])

    for msg in msgs:
        event = {'event': 'RECEIVED_MSG', 'data': msg}
        publisher.publish(g.api_user, event)

    print('hey it worked')
    return sign_response('hey great')


@app.route('/message/send', methods=['POST'])
@authentication_required
def send_message():
    msg = request.get_json()['body']

    # TODO: route to phone

    print('>> sending message: ' + msg)
    return sign_response('neat')
