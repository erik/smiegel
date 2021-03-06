import base64
import hmac
import os

from hashlib import sha256


def authenticate(token, message):
    """Generate a HMAC for the given message using the token.

    Args:
      token (bytearray): The shared authentication token to use.
      message (str): The text to authenticate.

    Returns:
      str: base64 encoded HMAC
    """

    msg_bytes = bytearray(message, 'utf-8')
    mac = hmac.new(token, msg_bytes, sha256).digest()

    return b64_encode(mac)


def generate_auth_token(byte_len=32):
    """Securely generate an authentication token of the appropriate length.

    Returns:
      bytearray: token
    """
    return os.urandom(byte_len)


def b64_encode(msg):
    """Return the base64 representation of msg.

    TODO: types and whatnot
    """
    return base64.b64encode(msg).decode('utf-8')


def b64_decode(b64):
    """Returns bytes representing given b64 encoded string"""
    return base64.b64decode(b64.decode('utf-8'))


# from http://flask.pocoo.org/snippets/116/
class Event:

    def __init__(self, event, data):
        self.event = event
        self.data = data

    def encodeSse(self):
        if not self.data:
            return ""

        event = [
            ("event", self.event),
            ("data", self.data)
        ]

        lines = ["%s: %s" % (k, v) for k, v in event if v]

        return "%s\n\n" % "\n".join(lines)
