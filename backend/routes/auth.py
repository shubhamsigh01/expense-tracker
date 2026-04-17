from flask import Blueprint, request, jsonify
import bcrypt
from flask_jwt_extended import create_access_token
from models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    if User.objects(email=email).first():
        return jsonify({"msg": "Email already registered"}), 400

    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    
    # Store as string for broad database compatibility
    new_user = User(email=email, password_hash=hashed_password.decode('utf-8'))
    
    new_user.save()

    return jsonify({"msg": "User created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.objects(email=email).first()

    if not user:
        return jsonify({"msg": "Bad email or password"}), 401

    hashed = user.password_hash.encode('utf-8')
    if not bcrypt.checkpw(password.encode('utf-8'), hashed):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify(access_token=access_token)
