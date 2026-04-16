import { motion } from "motion/react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: string;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
  icon: LucideIcon;
  iconColor: string;
  delay?: number;
}

export function StatCard({ title, value, trend, icon: Icon, iconColor, delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    // Extract number from value string (e.g., "₹45,230" -> 45230)
    const numericValue = parseInt(value.replace(/[^\d]/g, ""), 10) || 0;
    const prefix = value.match(/[^\d,]+/)?.[0] || "";
    
    const duration = 800;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, numericValue);
      const formatted = Math.round(current).toLocaleString("en-IN");
      setDisplayValue(prefix + formatted);

      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground mb-2">{title}</p>
          <p className="font-semibold mb-2" style={{ fontSize: "28px" }}>
            {displayValue}
          </p>
          {trend && (
            <div className="flex items-center gap-1">
              {trend.direction === "up" ? (
                <TrendingUp className="w-4 h-4 text-secondary" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
              <span
                className={`${
                  trend.direction === "up" ? "text-secondary" : "text-destructive"
                }`}
              >
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: iconColor }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
