import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface CategoryPillProps {
  category: string;
  isAiDetected?: boolean;
  variant?: "default" | "small";
}

export function CategoryPill({ category, isAiDetected = false, variant = "default" }: CategoryPillProps) {
  const categoryColors: Record<string, string> = {
    Food: "bg-[#FEF3C7] text-[#92400E]",
    Transport: "bg-[#DBEAFE] text-[#1E40AF]",
    Shopping: "bg-[#FCE7F3] text-[#9F1239]",
    Entertainment: "bg-[#E0E7FF] text-[#3730A3]",
    Bills: "bg-[#FEE2E2] text-[#991B1B]",
    Health: "bg-[#D1FAE5] text-[#065F46]",
    Other: "bg-[#F3F4F6] text-[#374151]",
  };

  const colorClass = categoryColors[category] || categoryColors.Other;
  const sizeClass = variant === "small" ? "text-xs px-2 py-1" : "text-sm px-3 py-1.5";

  if (isAiDetected) {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          boxShadow: [
            "0 0 0 0px rgba(199, 194, 248, 0)",
            "0 0 0 4px rgba(199, 194, 248, 0.4)",
            "0 0 0 0px rgba(199, 194, 248, 0)"
          ]
        }}
        transition={{ 
          duration: 0.3,
          boxShadow: {
            times: [0, 0.5, 1],
            duration: 1,
            delay: 0.2
          }
        }}
        className="inline-flex items-center gap-1.5"
      >
        <span className={`${colorClass} ${sizeClass} rounded-full font-medium inline-flex items-center gap-1`}>
          {category}
        </span>
        <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full font-medium inline-flex items-center gap-0.5">
          <Sparkles className="w-3 h-3" />
          AI
        </span>
      </motion.div>
    );
  }

  return (
    <span className={`${colorClass} ${sizeClass} rounded-full font-medium inline-block`}>
      {category}
    </span>
  );
}
