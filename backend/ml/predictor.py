import pandas as pd
from datetime import datetime

def predict_next_month(expenses) -> dict:
    if not expenses:
        return {}

    df = pd.DataFrame([
        {
            'category': e.category if hasattr(e, 'category') else e['category'],
            'amount': e.amount if hasattr(e, 'amount') else e['amount'],
            'date': pd.to_datetime(e.date if hasattr(e, 'date') else e['date'])
        }
        for e in expenses
    ])

    df['YearMonth'] = df['date'].dt.to_period('M')
    monthly_spend = df.groupby(['category', 'YearMonth'])['amount'].sum().reset_index()

    predictions = {}
    categories = monthly_spend['category'].unique()

    current_month = pd.to_datetime('today').to_period('M')

    for cat in categories:
        cat_data = monthly_spend[monthly_spend['category'] == cat]
        
        last_3_months = [current_month - i for i in range(1, 4)]
        
        total_3_months = 0
        for m in last_3_months:
            val = cat_data[cat_data['YearMonth'] == m]['amount'].sum()
            total_3_months += val
            
        ma = total_3_months / 3.0
        if ma > 0:
            predictions[cat] = round(ma, 2)
            
    return predictions

def get_insights(expenses, budgets=None) -> list[str]:
    insights = []
    if not expenses:
        return ["Not enough data to generate insights yet. Add some expenses!"]

    df = pd.DataFrame([
        {
            'category': e.category if hasattr(e, 'category') else e['category'],
            'amount': e.amount if hasattr(e, 'amount') else e['amount'],
            'date': pd.to_datetime(e.date if hasattr(e, 'date') else e['date'])
        }
        for e in expenses
    ])
    
    current_month = pd.to_datetime('today').to_period('M')
    this_month_data = df[df['date'].dt.to_period('M') == current_month]
    if this_month_data.empty:
        this_month_totals = pd.Series(dtype=float)
    else:
        this_month_totals = this_month_data.groupby('category')['amount'].sum()

    predictions = predict_next_month(expenses)

    for cat, current_spend in this_month_totals.items():
        if cat in predictions and predictions[cat] > 0:
            avg_spend = predictions[cat]
            if current_spend > avg_spend * 1.3:
                insights.append(f"Spending on {cat} is {((current_spend/avg_spend)-1)*100:.0f}% higher than your 3-month average of ₹{avg_spend:.2f}.")
    
    if budgets:
        budget_dict = {b.category if hasattr(b, 'category') else b['category']: b.monthly_limit if hasattr(b, 'monthly_limit') else b['monthly_limit'] for b in budgets}
        for cat, current_spend in this_month_totals.items():
            if cat in budget_dict:
                limit = budget_dict[cat]
                if current_spend > limit:
                     insights.append(f"Budget exceeded for {cat} by ₹{current_spend - limit:.2f}.")
                elif current_spend > limit * 0.8:
                     remaining = limit - current_spend
                     insights.append(f"Approaching budget limit for {cat}. ₹{remaining:.2f} remaining.")
                else:
                     remaining = limit - current_spend
                     insights.append(f"Spending for {cat} is well within budget. ₹{remaining:.2f} remaining.")

    if not insights:
        insights.append("Spending patterns are within normal historical ranges.")

    return insights
