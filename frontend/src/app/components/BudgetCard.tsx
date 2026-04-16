import { motion } from "motion/react";
import { LucideIcon, Pencil } from "lucide-react";

interface BudgetCardProps {
  id: number;
  category: string;
  icon: LucideIcon;
  spent: number;
  budget: number;
  color: string;
  delay?: number;
  isHovered: boolean;
  onHover: (id: number | null) => void;
}

export function BudgetCard({
  id,
  category,
  icon: Icon,
  spent,
  budget,
  color,
  delay = 0,
  isHovered,
  onHover,
}: BudgetCardProps) {
  const percentage = (spent / budget) * 100;
  
  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "#F05C47"; // Coral - over budget
    if (percentage >= 80) return "#F59E0B"; // Amber - warning
    return "#5B4EE8"; // Indigo - normal
  };

  const progressColor = getProgressColor(percentage);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 relative group"
    >
      {/* Edit Button - shows on hover */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute top-4 right-4 p-2 hover:bg-muted rounded-xl transition-colors"
      >
        <Pencil className="w-4 h-4 text-muted-foreground" />
      </motion.button>

      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: color + "20" }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{category}</h3>
          <p className="text-muted-foreground">
            ₹{spent.toLocaleString("en-IN")} / ₹{budget.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.6, delay: 0.2 + delay, ease: "easeInOut" }}
          className="absolute left-0 top-0 bottom-0 rounded-full"
          style={{ backgroundColor: progressColor }}
        />
      </div>

      {/* Status Text */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{percentage.toFixed(0)}% used</span>
        {percentage >= 100 && (
          <span className="text-sm font-medium text-destructive">Over budget!</span>
        )}
        {percentage >= 80 && percentage < 100 && (
          <span className="text-sm font-medium" style={{ color: "#F59E0B" }}>
            Nearing limit
          </span>
        )}
        {percentage < 80 && (
          <span className="text-sm font-medium text-secondary">On track</span>
        )}
      </div>
    </motion.div>
  );
}
