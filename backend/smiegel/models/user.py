from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

from smiegel import db
from smiegel.util import generate_auth_token

class User(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    auth_token  = db.Column(db.String(32), unique=True)
    login_email = db.Column(db.String(256), unique=True)

    def __init__(self, login_email, auth_token=None):
        self.login_email = login_email

        if auth_token is None:
            auth_token = generate_auth_token()

        self.auth_token = auth_token
