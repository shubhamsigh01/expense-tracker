from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Expense
from ml.classifier import predict
from datetime import datetime, timezone

expenses_bp = Blueprint('expenses', __name__)

def parse_iso_date(date_str: str) -> datetime:
    """Parse ISO date string, falling back to current UTC time if invalid or missing."""
    if not date_str:
        return datetime.now(timezone.utc)
    try:
        return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
    except (ValueError, TypeError):
        return datetime.now(timezone.utc)

@expenses_bp.route('', methods=['GET'])
@jwt_required()
def get_expenses():
    user_id = str(get_jwt_identity())
    expenses = Expense.objects(user_id=user_id).order_by('-date')
    return jsonify([e.to_dict() for e in expenses])

@expenses_bp.route('', methods=['POST'])
@jwt_required()
def create_expense():
    user_id = str(get_jwt_identity())
    data = request.get_json()
    
    amount = data.get('amount')
    description = data.get('description')
    
    if amount is None or not description:
        return jsonify({"msg": "Amount and description are required"}), 400
        
    date = parse_iso_date(data.get('date'))
    category = data.get('category') or predict(description)

    expense = Expense(
        user_id=user_id,
        amount=float(amount),
        description=description,
        category=category,
        date=date
    )
    expense.save()
    
    return jsonify(expense.to_dict()), 201

@expenses_bp.route('/<id>', methods=['PUT', 'DELETE'])
@jwt_required()
def update_delete_expense(id):
    user_id = str(get_jwt_identity())
    expense = Expense.objects(id=id, user_id=user_id).first()
    
    if not expense:
        return jsonify({"msg": "Expense not found"}), 404
        
    if request.method == 'DELETE':
        expense.delete()
        return jsonify({"msg": "Expense deleted successfully"}), 200
        
    data = request.get_json()
    if 'amount' in data:
        expense.amount = float(data['amount'])
    if 'description' in data:
        expense.description = data['description']
    if 'category' in data:
        expense.category = data['category']
    if 'date' in data:
        expense.date = parse_iso_date(data['date'])
            
    expense.save()
    return jsonify(expense.to_dict()), 200
