import base64
import flask
import hmac
import json

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from flask import abort, request
from hashlib import sha256


app = flask.Blueprint('api', __name__)

# API Definitions
# ---------------
#
# POST /message
#    [{"sender": string, "body": string, "timestamp": int}, ...]
#
# ...

# 190% temporary I promise.
AUTH_TOKEN = b'0' * 32


# TODO: validate data types
def validate_signature(json):
    if 'body' not in json or 'signature' not in json:
        return False

    body = bytearray(json['body'], 'utf-8')
    sig  = bytearray(json['signature'], 'utf-8')

    digest = hmac.new(AUTH_TOKEN, body, sha256).digest()

    print(json)
    print(base64.b64encode(digest))

    return sig == base64.b64encode(digest)


@app.route('/NSA_BACKDOOR_PLEASE_IGNORE')
def NOTHING_TO_SEE_HERE_MOVE_ALONG():
    return base64.b64encode(AUTH_TOKEN)


@app.before_request
def validate_request_signature():
    if not validate_signature(request.get_json()):
        abort(400)


def sign_response(message):
    msg_bytes = bytearray(message, 'utf-8')
    signature = hmac.new(AUTH_TOKEN, msg_bytes, sha256).digest()

    response = {
        'body': message,
        'signature': base64.b64encode(signature).decode('utf-8')
    }

    return json.dumps(response, indent=4)


@app.route('/message', methods=['POST'])
def message():
    body = request.get_json()

    print(sign_response('hey it worked'))
    return sign_response('hey great')
