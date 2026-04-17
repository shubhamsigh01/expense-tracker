import { motion } from "motion/react";
import { Wallet, PieChart, TrendingDown, Target } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { ExpenseRow } from "../components/ExpenseRow";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useState, useEffect } from "react";
import api from "../../api";
import { isCurrentMonth, getShortMonthName, isSameMonth, formatDisplayDate } from "../../utils/date";

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#F59E0B",
  Transport: "#3B82F6",
  Shopping: "#EC4899",
  Entertainment: "#8B5CF6",
  Bills: "#EF4444",
  Health: "#10B981",
  Other: "#6B7280"
};

export function Dashboard() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data } = await api.get('/expenses');
      setExpenses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const currentMonthExpenses = expenses.filter(e => isCurrentMonth(e.date));
  const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryMap: Record<string, number> = {};
  currentMonthExpenses.forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });
  
  const categoryData = Object.keys(categoryMap).map(k => ({ 
    name: k, 
    amount: categoryMap[k],
    color: CATEGORY_COLORS[k] || "#6B7280"
  })).sort((a,b) => b.amount - a.amount);

  const biggestCategory = categoryData.length > 0 ? categoryData[0].name : "None";

  const monthlyData = [];
  const now = new Date();
  for(let i=5; i>=0; i--) {
     const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
     const monthStr = getShortMonthName(d);
     
     const monthTotal = expenses
       .filter(e => isSameMonth(e.date, d.getMonth(), d.getFullYear()))
       .reduce((sum, e) => sum + e.amount, 0);
     
     monthlyData.push({ month: monthStr, amount: monthTotal });
  }

  const recentExpenses = expenses.slice(0, 5).map(e => ({
     id: e.id,
     date: formatDisplayDate(e.date),
     description: e.description,
     category: e.category,
     amount: "₹" + e.amount.toFixed(2)
  }));

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-semibold mb-1" style={{ fontSize: "28px" }}>
          Dashboard
        </h1>
        <p className="text-muted-foreground">Monthly spending overview</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Spent"
          value={`₹${totalSpent.toFixed(2)}`}
          trend={{ value: "Active", direction: "up" }}
          icon={Wallet}
          iconColor="#5B4EE8"
          delay={0}
        />
        <StatCard
          title="Biggest Category"
          value={biggestCategory}
          icon={PieChart}
          iconColor="#22C08B"
          delay={0.1}
        />
        <StatCard
          title="Transactions"
          value={currentMonthExpenses.length.toString()}
          icon={TrendingDown}
          iconColor="#F59E0B"
          delay={0.2}
        />
        <StatCard
          title="All Time Total"
          value={`₹${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}`}
          icon={Target}
          iconColor="#F05C47"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-semibold mb-6">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            {categoryData.length > 0 ? (
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#EFEFED" />
              <XAxis type="number" stroke="#6B6B6B" />
              <YAxis dataKey="name" type="category" stroke="#6B6B6B" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #EFEFED",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
                {categoryData.map((entry, index) => (
                  <motion.rect
                    key={`bar-${index}`}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.08, ease: "easeOut" }}
                    fill={entry.color}
                  />
                ))}
              </Bar>
            </BarChart>
            ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">No data for this month</div>
            )}
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-card rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-semibold mb-6">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5B4EE8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5B4EE8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFEFED" />
              <XAxis dataKey="month" stroke="#6B6B6B" />
              <YAxis stroke="#6B6B6B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #EFEFED",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#5B4EE8"
                strokeWidth={3}
                fill="url(#colorAmount)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-card rounded-2xl p-6 shadow-sm"
      >
        <h3 className="font-semibold mb-4">Recent Expenses</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Description</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amount</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {recentExpenses.length === 0 && (
                <tr><td colSpan={5} className="py-4 text-center text-muted-foreground">No recent expenses</td></tr>
              )}
              {recentExpenses.map((expense) => (
                <ExpenseRow
                  key={expense.id}
                  id={expense.id}
                  date={expense.date}
                  description={expense.description}
                  category={expense.category}
                  amount={expense.amount}
                  isHovered={hoveredRow === expense.id}
                  onHover={setHoveredRow}
                />
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}