from flask import Flask, send_file, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
import mongoengine
from routes.auth import auth_bp
from routes.expenses import expenses_bp
from routes.insights import insights_bp
from routes.budgets import budgets_bp

import pandas as pd
import io
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Expense

app = Flask(__name__)
app.config.from_object(Config)

# CORS — open to all origins while Vercel URL is being confirmed.
# TODO: Replace "*" with your exact Vercel URL once known, e.g.:
# CORS(app, origins=["https://your-app.vercel.app", "http://localhost:5173"], supports_credentials=False)
CORS(app, origins="*")

mongoengine.connect(host=app.config['MONGODB_SETTINGS']['host'])
jwt = JWTManager(app)

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(expenses_bp, url_prefix='/expenses')
app.register_blueprint(insights_bp, url_prefix='/insights')
app.register_blueprint(budgets_bp, url_prefix='/budgets')

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint — used by Vercel frontend to wake the Render instance."""
    return jsonify({"status": "ok", "service": "expense-tracker-api"}), 200

@app.route('/export', methods=['GET'])
@jwt_required()
def export_expenses():
    user_id = str(get_jwt_identity())
    expenses = Expense.objects(user_id=user_id)
    
    data = [
        {
            "id": e.id,
            "amount": e.amount,
            "description": e.description,
            "category": e.category,
            "date": e.date.isoformat(),
            "created_at": e.created_at.isoformat()
        } for e in expenses
    ]
    df = pd.DataFrame(data)
    
    output = io.BytesIO()
    df.to_csv(output, index=False)
    output.seek(0)
    
    return send_file(
        output,
        mimetype='text/csv',
        as_attachment=True,
        download_name='expenses.csv'
    )

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('FLASK_ENV') == 'development')
