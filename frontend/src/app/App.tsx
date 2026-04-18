/**
 * ExpenseAI - Expense Tracker with AI Insights
 * 
 * A premium, production-ready expense tracking application with AI-powered insights.
 * 
 * Design System:
 * - Background: #F9F8F6 (warm off-white)
 * - Primary: #5B4EE8 (indigo-violet)
 * - Secondary: #22C08B (soft emerald)
 * - Danger: #F05C47 (warm coral)
 * - Typography: Inter font, 600 for headings, 500 for labels, 400 for body
 * - Border Radius: 16px for cards, 12px for inputs/buttons
 * - Shadows: Soft layered shadows for premium feel
 * 
 * Key Features:
 * - Dashboard with animated stat cards, charts, and expense table
 * - AI-powered category detection with visual feedback
 * - Budget tracking with progress indicators
 * - Insights page with predictions and saving suggestions
 * - Smooth animations and micro-interactions
 * - Fully responsive design
 */

import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { wakeBackend } from "../api";

export default function App() {
  useEffect(() => {
    // Pre-warm the Render backend on app load to minimize cold-start delays
    wakeBackend();
  }, []);

  return <RouterProvider router={router} />;
}
