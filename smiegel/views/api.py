import flask
import json

from flask import abort, current_app, g, request
from functools import wraps

from smiegel import util
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
# POST /message
#    [{"sender": string, "body": string, "timestamp": int}, ...]
#
# ...

REQUIRED_KEYS = ['body', 'signature', 'user-id']

# 190% temporary I promise.
AUTH_TOKEN = b'0' * 32

def authentication_required(func):
    """For routes that require messages be authenticated"""
    @wraps(func)
    def decorator(*args, **kwargs):
        json = request.get_json(silent=True)

        if not (json and validate_signature(json)):
            abort(401)

    return decorator


# TODO: validate data types
def validate_signature(json):
    if not all([k in json for k in REQUIRED_KEYS]):
        return False

    g.user = User.query.get(json['user-id'])
    if not user:
        return False

    return json['signature'] == util.authenticate(g.user.auth_token, json['body'])


@app.route('/NSA_BACKDOOR_PLEASE_IGNORE')
def NOTHING_TO_SEE_HERE_MOVE_ALONG():
    return util.b64_encode(AUTH_TOKEN)


def sign_response(message):
    response = {
        'body': message,
        'signature': util.authenticate(g.user.auth_token, message)
    }

    return json.dumps(response, indent=4)


@app.route('/message', methods=['POST'])
@authentication_required
def message():
    print(sign_response('hey it worked'))
    return sign_response('hey great')
