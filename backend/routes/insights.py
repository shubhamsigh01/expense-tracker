from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Expense, Budget
from ml.predictor import get_insights, predict_next_month

insights_bp = Blueprint('insights', __name__)

@insights_bp.route('', methods=['GET'])
@jwt_required()
def user_insights():
    user_id = str(get_jwt_identity())
    expenses = Expense.objects(user_id=user_id)
    budgets = Budget.objects(user_id=user_id)
    
    insights = get_insights(expenses, budgets)
    predicted_spend = predict_next_month(expenses)
    
    return jsonify({
        "insights": insights,
        "predictedSpend": predicted_spend
    })
