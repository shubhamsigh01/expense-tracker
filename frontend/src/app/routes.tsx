/**
 * ExpenseAI - Expense Tracker with AI Insights
 * 
 * A premium fintech SaaS application for tracking expenses with AI-powered insights.
 * Features a modern light theme with warm off-white background and indigo-violet accents.
 * 
 * Routes:
 * - / : Dashboard with stats, charts, and recent expenses
 * - /insights : AI insights, predictions, and saving suggestions
 * - /budgets : Budget tracking with progress indicators
 * - /settings : Account and app settings
 */

import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Insights } from "./pages/Insights";
import { Budgets } from "./pages/Budgets";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { index: true, Component: Dashboard },
      { path: "insights", Component: Insights },
      { path: "budgets", Component: Budgets },
      { path: "settings", Component: Settings },
    ],
  },
]);