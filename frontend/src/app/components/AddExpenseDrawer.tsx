import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Tag, IndianRupee } from "lucide-react";
import { useState } from "react";
import { CategoryPill } from "./CategoryPill";
import api from "../../api";

interface AddExpenseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = ["Food", "Transport", "Shopping", "Entertainment", "Bills", "Health", "Other"];

export function AddExpenseDrawer({ isOpen, onClose }: AddExpenseDrawerProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState("Food");
  const [isAiDetected, setIsAiDetected] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
       const payload: any = {
          amount: Number(amount),
          description,
          date: new Date(date).toISOString()
       };
       if(category !== "Auto (AI)") payload.category = category;

       const { data } = await api.post('/expenses', payload);
       
       console.log("Saved", data);
       setCategory(data.category);
       setIsAiDetected(true);
       
       setTimeout(() => {
          onClose();
          setAmount("");
          setDescription("");
          setDate(new Date().toISOString().split('T')[0]);
          setCategory("Auto (AI)");
          setIsAiDetected(false);
          setIsLoading(false);
          window.location.reload(); // Simple refresh for now to update dashboard state
       }, 1500);

    } catch (err) {
       console.error(err);
       setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/12 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[480px] bg-card shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-semibold">Add New Expense</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Amount */}
              <div>
                <label className="block mb-2 text-muted-foreground">Amount</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full h-14 pl-12 pr-4 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                    style={{ fontSize: "24px" }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-muted-foreground">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setIsAiDetected(false);
                  }}
                  placeholder="e.g., Lunch at cafe"
                  className="w-full h-12 px-4 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block mb-2 text-muted-foreground">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block mb-2 text-muted-foreground">Category</label>
                <div className="flex items-center gap-2 mb-3">
                  <CategoryPill category={category} isAiDetected={isAiDetected} />
                </div>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setIsAiDetected(false);
                    }}
                    className="w-full h-12 pl-12 pr-4 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                  >
                    <option value="Auto (AI)">Auto-categorize using AI</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* AI Info Box */}
              {isAiDetected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-accent/50 border border-accent rounded-xl p-4"
                >
                  <p className="text-sm text-accent-foreground">
                    ✨ Category auto-detected using AI based on your description.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border">
              <button
                onClick={handleSave}
                disabled={!amount || !description || isLoading}
                className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10">{isLoading ? "Processing..." : "Save Expense"}</span>
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
