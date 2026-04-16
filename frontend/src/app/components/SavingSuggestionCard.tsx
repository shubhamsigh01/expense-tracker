import { motion } from "motion/react";
import { Lightbulb } from "lucide-react";

interface SavingSuggestionCardProps {
  text: string;
  saving: string;
  delay?: number;
}

export function SavingSuggestionCard({ text, saving, delay = 0 }: SavingSuggestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-card rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow duration-200"
    >
      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
        <Lightbulb className="w-5 h-5 text-secondary" />
      </div>
      <p className="flex-1">{text}</p>
      <span className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-full font-medium flex-shrink-0">
        {saving}
      </span>
    </motion.div>
  );
}
