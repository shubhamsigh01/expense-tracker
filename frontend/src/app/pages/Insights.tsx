import { motion } from "motion/react";
import { Sparkles, AlertCircle, TrendingUp, Info } from "lucide-react";
import { SavingSuggestionCard } from "../components/SavingSuggestionCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useEffect, useRef, useState } from "react";
import api from "../../api";
import { isCurrentMonth } from "../../utils/date";

export function Insights() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [predictionData, setPredictionData] = useState<any[]>([]);
  const [savingSuggestions, setSavingSuggestions] = useState<any[]>([]);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const [{ data: insightsData }, { data: expenses }] = await Promise.all([
         api.get('/insights'),
         api.get('/expenses')
      ]);

      const thisMonthTotals: Record<string, number> = {};
      expenses.forEach((e: any) => {
         if(isCurrentMonth(e.date)) {
            thisMonthTotals[e.category] = (thisMonthTotals[e.category] || 0) + e.amount;
         }
      });

      const processedPredictions = Object.keys(insightsData.predictedSpend).map(cat => ({
         category: cat,
         thisMonth: thisMonthTotals[cat] || 0,
         nextMonth: insightsData.predictedSpend[cat]
      }));
      setPredictionData(processedPredictions);

      const parsedInsights = insightsData.insights.map((text: string, i: number) => {
         let icon = Info;
         let title = "Spending Pattern";
         let accentColor = "#5B4EE8";

         if(text.includes("higher than") || text.includes("exceeded")) {
             icon = AlertCircle;
             accentColor = "#F05C47";
             title = "Action Required";
         } else if (text.includes("within budget") || text.includes("Well within")) {
             icon = TrendingUp;
             accentColor = "#22C08B";
             title = "Efficiency Found";
         } else if (text.includes("Patterns are within")) {
             icon = Info;
             accentColor = "#5B4EE8";
             title = "System Review";
         }

         return { id: i, icon, title, description: text, accentColor };
      });

      setInsights(parsedInsights);
      
      const suggestions = processedPredictions
         .filter(p => p.thisMonth > p.nextMonth)
         .map((p, i) => ({
            id: i,
            text: `Current ${p.category} spending is ₹${p.thisMonth}. Target for next month is ₹${p.nextMonth}.`,
            saving: "₹" + (p.thisMonth - p.nextMonth).toFixed(2) + " optimized allocation"
         }));
      setSavingSuggestions(suggestions);

    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardsRef.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1 && !visibleCards.includes(index)) {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index]);
              }, index * 100);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [insights]);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="font-semibold" style={{ fontSize: "28px" }}>
            Spending Insights
          </h1>
        </div>
        <p className="text-muted-foreground">Data-driven analysis of your allocation</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
            initial={{ opacity: 0, y: 16 }}
            animate={
              visibleCards.includes(index)
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 16 }
            }
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-card rounded-2xl p-6 shadow-sm relative overflow-hidden"
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-1"
              style={{ backgroundColor: insight.accentColor }}
            />
            <div className="ml-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: insight.accentColor + "20" }}
              >
                <insight.icon className="w-6 h-6" style={{ color: insight.accentColor }} />
              </div>
              <h3 className="font-semibold mb-2">{insight.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{insight.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-card rounded-2xl p-6 shadow-sm"
      >
        <h3 className="font-semibold mb-6">Allocation Forecast</h3>
        <ResponsiveContainer width="100%" height={320}>
          {predictionData.length > 0 ? (
          <BarChart data={predictionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EFEFED" />
            <XAxis dataKey="category" stroke="#6B6B6B" />
            <YAxis stroke="#6B6B6B" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #EFEFED",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
            <Legend />
            <Bar dataKey="thisMonth" fill="#C7D2FE" name="Current Month" radius={[8, 8, 0, 0]} />
            <Bar dataKey="nextMonth" fill="#5B4EE8" name="Projected Next Month" radius={[8, 8, 0, 0]} />
          </BarChart>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">Insufficient data for forecasting.</div>
          )}
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="space-y-4"
      >
        <h3 className="font-semibold">Optimization Targets</h3>
        <div className="space-y-3">
          {savingSuggestions.length > 0 ? savingSuggestions.map((suggestion, index) => (
            <SavingSuggestionCard
              key={suggestion.id}
              text={suggestion.text}
              saving={suggestion.saving}
              delay={0.6 + index * 0.1}
            />
          )) : (
            <p className="text-muted-foreground">Historical consistency is high; no current anomalies identified.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}