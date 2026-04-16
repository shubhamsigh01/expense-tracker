import { NavLink, useNavigate } from "react-router";
import { LayoutDashboard, TrendingUp, Target, Settings, Wallet, LogOut } from "lucide-react";
import { NavItem } from "./NavItem";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/insights", label: "Insights", icon: TrendingUp },
  { to: "/budgets", label: "Budgets", icon: Target },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
     localStorage.removeItem('token');
     navigate('/login');
  };

  return (
    <aside className="w-60 bg-card border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold">ExpenseAI</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              exact={item.exact}
            />
          ))}
        </ul>
      </nav>

      {/* User Profile / Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-xl transition-all text-destructive">
          <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
             <LogOut className="w-4 h-4" />
          </div>
          <span className="font-medium text-sm">Log out</span>
        </button>
      </div>
    </aside>
  );
}