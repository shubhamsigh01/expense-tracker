import { motion } from "motion/react";
import { Utensils, Car, ShoppingBag, Tv, Receipt, Heart, Plus, MoreHorizontal } from "lucide-react";
import { BudgetCard } from "../components/BudgetCard";
import { useState, useEffect } from "react";
import api from "../../api";

const CATEGORY_ICONS: Record<string, any> = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  Entertainment: Tv,
  Bills: Receipt,
  Health: Heart,
  Other: MoreHorizontal
};

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#F59E0B",
  Transport: "#3B82F6",
  Shopping: "#EC4899",
  Entertainment: "#8B5CF6",
  Bills: "#EF4444",
  Health: "#10B981",
  Other: "#6B7280"
};

export function Budgets() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [currentSpends, setCurrentSpends] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newLimit, setNewLimit] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [budgetsRes, expensesRes] = await Promise.all([
        api.get('/budgets'),
        api.get('/expenses')
      ]);
      
      const spendsMap: Record<string, number> = {};
      const now = new Date();
      expensesRes.data.forEach((e: any) => {
         const d = new Date(e.date);
         if(d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
            spendsMap[e.category] = (spendsMap[e.category] || 0) + e.amount;
         }
      });

      setBudgets(budgetsRes.data);
      setCurrentSpends(spendsMap);
    } catch(err) {
      console.error(err);
    }
  };

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/budgets', {
         category: newCategory,
         monthly_limit: Number(newLimit)
      });
      setIsModalOpen(false);
      fetchData();
    } catch(err) {
      console.error(err);
    }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.monthly_limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (currentSpends[b.category] || 0), 0);
  const remaining = Math.max(0, totalBudget - totalSpent);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-semibold mb-1" style={{ fontSize: "28px" }}>
          Budget Overview
        </h1>
        <p className="text-muted-foreground">Track your spending against your monthly budgets</p>
      </motion.div>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-2 gap-6">
        {budgets.map((budget, index) => (
          <BudgetCard
            key={budget.id}
            id={budget.id}
            category={budget.category}
            icon={CATEGORY_ICONS[budget.category] || MoreHorizontal}
            spent={currentSpends[budget.category] || 0}
            budget={budget.monthly_limit}
            color={CATEGORY_COLORS[budget.category] || "#6B7280"}
            delay={index * 0.08}
            isHovered={hoveredCard === budget.id}
            onHover={setHoveredCard}
          />
        ))}

        {/* Add Budget Card */}
        <motion.button
          onClick={() => setIsModalOpen(true)}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: budgets.length * 0.08 }}
          className="bg-card rounded-2xl p-6 border-2 border-dashed border-border hover:border-primary hover:bg-accent/30 transition-all duration-200 flex flex-col items-center justify-center gap-3 min-h-[180px] group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <span className="font-medium text-muted-foreground group-hover:text-primary transition-colors">
            Add/Update Budget
          </span>
        </motion.button>
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid grid-cols-3 gap-6"
      >
        <div className="bg-card rounded-2xl p-6 shadow-sm">
          <p className="text-muted-foreground mb-2">Total Allocated Budgets</p>
          <p className="font-semibold" style={{ fontSize: "24px" }}>
            ₹{totalBudget.toFixed(2)}
          </p>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-sm">
          <p className="text-muted-foreground mb-2">Total Spent (Watched Categories)</p>
          <p className="font-semibold" style={{ fontSize: "24px" }}>
            ₹{totalSpent.toFixed(2)}
          </p>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-sm">
          <p className="text-muted-foreground mb-2">Remaining</p>
          <p className="font-semibold text-secondary" style={{ fontSize: "24px" }}>
            ₹{remaining.toFixed(2)}
          </p>
        </div>
      </motion.div>

      {/* Add Budget Modal equivalent */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="bg-card rounded-3xl p-8 w-[400px] shadow-2xl border border-border">
             <h3 className="text-2xl font-semibold mb-6">Set Category Limit</h3>
             <form onSubmit={handleAddBudget} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                     value={newCategory}
                     onChange={e => setNewCategory(e.target.value)}
                     className="w-full h-12 px-4 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                     required
                  >
                     <option value="">Select a category</option>
                     {Object.keys(CATEGORY_ICONS).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Limit (₹)</label>
                  <input
                     type="number"
                     value={newLimit}
                     onChange={e => setNewLimit(e.target.value)}
                     className="w-full h-12 px-4 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                     required
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-muted-foreground hover:bg-accent font-medium">Cancel</button>
                   <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold">Save Budget</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}