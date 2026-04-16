from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Budget

budgets_bp = Blueprint('budgets', __name__)

@budgets_bp.route('', methods=['GET'])
@jwt_required()
def get_budgets():
    user_id = str(get_jwt_identity())
    budgets = Budget.objects(user_id=user_id)
    return jsonify([b.to_dict() for b in budgets])

@budgets_bp.route('', methods=['POST'])
@jwt_required()
def set_budget():
    user_id = str(get_jwt_identity())
    data = request.get_json()
    
    category = data.get('category')
    monthly_limit = data.get('monthly_limit')
    
    if not category or monthly_limit is None:
        return jsonify({"msg": "Missing category or limit"}), 400
        
    budget = Budget.objects(user_id=user_id, category=category).first()
    if budget:
        budget.monthly_limit = float(monthly_limit)
    else:
        budget = Budget(user_id=user_id, category=category, monthly_limit=float(monthly_limit))
        
    budget.save()
    return jsonify(budget.to_dict()), 200
