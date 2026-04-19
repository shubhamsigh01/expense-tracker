import os
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()

def _encode_mongo_uri(uri: str) -> str:
    """
    Safely URL-encode credentials in a MongoDB URI.

    Uses rfind('@') to locate the LAST '@' as the credentials/host
    separator — this correctly handles passwords that themselves
    contain '@', '#', '!', '$', etc.
    """
    try:
        if '://' not in uri or '@' not in uri:
            return uri  # no credentials to encode

        scheme, rest = uri.split('://', 1)

        # The LAST '@' separates credentials from the host
        at_idx = rest.rfind('@')
        cred_part = rest[:at_idx]       # "username:password"
        host_part = rest[at_idx + 1:]   # "cluster.mongodb.net/db?opts"

        # The FIRST ':' separates username from password
        colon_idx = cred_part.find(':')
        if colon_idx == -1:
            return uri  # unexpected format — leave unchanged

        username = cred_part[:colon_idx]
        password = cred_part[colon_idx + 1:]

        encoded_user = quote_plus(username)
        encoded_pass = quote_plus(password)

        return f"{scheme}://{encoded_user}:{encoded_pass}@{host_part}"

    except Exception:
        return uri  # never crash on startup — return raw URI as fallback


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

