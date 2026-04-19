import os
import re
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()

def _encode_mongo_uri(uri: str) -> str:
    """
    URL-encode the username and password portion of a MongoDB URI.
    Handles special characters (!, @, #, $, etc.) that break pymongo's parser.
    """
    pattern = r'^(mongodb(?:\+srv)?://)([^:]+):([^@]+)@(.+)$'
    match = re.match(pattern, uri)
    if match:
        scheme, user, password, rest = match.groups()
        return f"{scheme}{quote_plus(user)}:{quote_plus(password)}@{rest}"
    return uri  # no credentials found — return as-is

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-do-not-use-in-prod')
    _raw_mongo_uri = (
        os.environ.get('MONGO_URI')
        or os.environ.get('Mongo_URI')
        or 'mongodb://localhost:27017/expense_tracker'
    )
    MONGODB_SETTINGS = {
        'host': _encode_mongo_uri(_raw_mongo_uri)
    }
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-dev-secret-key')
