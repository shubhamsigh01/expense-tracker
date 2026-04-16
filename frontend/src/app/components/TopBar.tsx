import { Search, Bell, Plus } from "lucide-react";
import { useLocation } from "react-router";

interface TopBarProps {
  onAddExpense: () => void;
}

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/insights": "AI Insights",
  "/budgets": "Budgets",
  "/settings": "Settings",
};

export function TopBar({ onAddExpense }: TopBarProps) {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "Dashboard";

  return (
    <header className="bg-card border-b border-border px-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold">{pageTitle}</h1>
        
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search expenses..."
              className="w-64 pl-10 pr-4 py-2 bg-muted border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-muted rounded-xl transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
          </button>

          {/* Add Expense Button */}
          <button
            onClick={onAddExpense}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        </div>
      </div>
    </header>
  );
}
