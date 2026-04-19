import os
from dotenv import load_dotenv

load_dotenv()
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-do-not-use-in-prod')
    MONGODB_SETTINGS = {
        'host': os.environ.get('MONGO_URI') or os.environ.get('Mongo_URI', 'mongodb://localhost:27017/expense_tracker')
    }
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-dev-secret-key')
