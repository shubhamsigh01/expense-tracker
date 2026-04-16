from flask import Flask, send_file
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

CORS(app)
mongoengine.connect(host=app.config['MONGODB_SETTINGS']['host'])
jwt = JWTManager(app)

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(expenses_bp, url_prefix='/expenses')
app.register_blueprint(insights_bp, url_prefix='/insights')
app.register_blueprint(budgets_bp, url_prefix='/budgets')

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
    from waitress import serve
    import os
    if os.environ.get('FLASK_ENV') == 'development':
        app.run(debug=True, port=8000)
    else:
        print("Starting WSGI Waitress Server on port 8000...")
        serve(app, host='0.0.0.0', port=8000)
