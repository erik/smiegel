import datetime

from smiegel import db


class Message(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    timestamp   = db.Column(db.DateTime)
    text        = db.Column(db.Text)
    user_id     = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, user_id, text, timestamp=None):
        if timestamp is None:
            timestamp = datetime.datetime.utcnow()

        self.timestamp = timestamp
        self.user_id = user_id
        self.text = text
