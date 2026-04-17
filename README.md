# Expense Tracker & Allocation Analyzer

A specialized dashboard for monitoring personal expenditures and generating predictive allocation insights. This tool automates expense categorization using a Naive Bayes classifier and provides historical trend analysis.

## Key Features

- **Automated Categorization**: Uses TF-IDF and Naive Bayes to classify transaction descriptions into functional categories.
- **Predictive Forecasting**: Generates next-month spending projections based on a 3-month moving average.
- **Dynamic Dashboard**: Real-time visualization of spending patterns using Recharts.
- **Budget Tracking**: Comparative analysis of actual spending against user-defined monthly limits.
- **Secure Authentication**: JWT-based user sessions with encrypted credential storage.

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite), TypeScript, Tailwind CSS, Recharts, Lucide Icons |
| **Backend** | Python (Flask), MongoEngine |
| **Machine Learning** | Scikit-learn (Naive Bayes, TF-IDF) |
| **Database** | MongoDB Atlas |

## Quick Start

### Backend

1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure environment variables in `.env`.
4. Start the server:
   ```bash
   python app.py
   ```

### Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Contributing

Contributions are welcome. Please ensure that logic refactors maintain 100% compatibility with the existing MongoDB schema and JWT implementation. Submit pull requests with a clear description of the optimization.
