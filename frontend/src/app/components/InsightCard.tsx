import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";

interface InsightCardProps {
  type: "warning" | "positive" | "neutral";
  icon: LucideIcon;
  title: string;
  description: string;
  accentColor: string;
  delay?: number;
}

export const InsightCard = forwardRef<HTMLDivElement, InsightCardProps>(
  ({ type, icon: Icon, title, description, accentColor, delay = 0 }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-card rounded-2xl p-6 shadow-sm relative overflow-hidden"
      >
        {/* Accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: accentColor }}
        />
        <div className="ml-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ backgroundColor: accentColor + "20" }}
          >
            <Icon className="w-6 h-6" style={{ color: accentColor }} />
          </div>
          <h3 className="font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    );
  }
);

InsightCard.displayName = "InsightCard";
