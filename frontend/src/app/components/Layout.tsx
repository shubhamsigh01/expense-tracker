import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { AddExpenseDrawer } from "./AddExpenseDrawer";
import { useState } from "react";

/**
 * Main layout component with sidebar, top bar, and content area.
 * Manages the global Add Expense drawer state.
 */
export function Layout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onAddExpense={() => setIsDrawerOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[960px] mx-auto p-8">
            <Outlet />
          </div>
        </main>
      </div>
      <AddExpenseDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </div>
  );
}