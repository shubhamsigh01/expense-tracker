import mongoengine as db
import datetime

class User(db.Document):
    email = db.StringField(required=True, unique=True, max_length=120)
    password_hash = db.StringField(required=True, max_length=256)

class Expense(db.Document):
    user_id = db.StringField(required=True)
    amount = db.FloatField(required=True)
    description = db.StringField(required=True, max_length=200)
    category = db.StringField(required=True, max_length=50)
    date = db.DateTimeField(required=True, default=datetime.datetime.utcnow)
    created_at = db.DateTimeField(default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            'id': str(self.id),
            'amount': self.amount,
            'description': self.description,
            'category': self.category,
            'date': self.date.isoformat(),
            'created_at': self.created_at.isoformat()
        }

class Budget(db.Document):
    user_id = db.StringField(required=True)
    category = db.StringField(required=True, max_length=50)
    monthly_limit = db.FloatField(required=True)

    def to_dict(self):
        return {
            'id': str(self.id),
            'category': self.category,
            'monthly_limit': self.monthly_limit
        }
