import { NavLink } from "react-router";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export function NavItem({ to, label, icon: Icon, exact = false }: NavItemProps) {
  return (
    <li>
      <NavLink
        to={to}
        end={exact}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
            <span className="font-medium">{label}</span>
          </>
        )}
      </NavLink>
    </li>
  );
}
