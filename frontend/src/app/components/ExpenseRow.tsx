import { motion } from "motion/react";
import { MoreVertical } from "lucide-react";
import { CategoryPill } from "./CategoryPill";

interface ExpenseRowProps {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: string;
  isHovered: boolean;
  onHover: (id: number | null) => void;
}

export function ExpenseRow({
  id,
  date,
  description,
  category,
  amount,
  isHovered,
  onHover,
}: ExpenseRowProps) {
  return (
    <motion.tr
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      className="border-b border-border/50 last:border-0 transition-colors duration-150"
      style={{
        backgroundColor: isHovered ? "#F9F8FF" : "transparent",
      }}
    >
      <td className="py-3 px-4 text-muted-foreground">{date}</td>
      <td className="py-3 px-4">{description}</td>
      <td className="py-3 px-4">
        <CategoryPill category={category} variant="small" />
      </td>
      <td className="py-3 px-4 text-right font-medium">{amount}</td>
      <td className="py-3 px-4">
        <button className="p-1 hover:bg-muted rounded-lg transition-colors">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      </td>
    </motion.tr>
  );
}
