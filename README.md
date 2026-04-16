# Expense Tracker with AI Insights

A full-stack web application for tracking personal expenses, automatically categorized via Machine Learning, and featuring AI-powered financial insights.

## Technologies Used
- **Frontend**: React (Vite), Tailwind CSS, Recharts, Axios, React Router Dom
- **Backend**: Flask, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-CORS
- **Machine Learning**: Scikit-learn (TfidfVectorizer + MultinomialNB text classification, 3-month Moving Average prediction)
- **Database**: SQLite (Development) / PostgreSQL-Ready

## Setup Instructions

### Backend Setup
1. Open terminal and go to the `backend` directory:
   ```bash
   cd expense-tracker/backend
   ```
2. Create and activate a Virtual Environment *(optional but recommended)*:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables: 
   Copy `.env.example` to `.env` (the application falls back to safe local dev defaults if omitted).
5. Run the server:
   ```bash
   python app.py
   ```
   *Note: This will automatically train the ML pipeline, seed the test data, create the SQLite DB, and bind to `http://localhost:8000`.*

### Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd expense-tracker/frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the displayed local server (usually `http://localhost:5173`) in your browser to access the Expense Tracker.
