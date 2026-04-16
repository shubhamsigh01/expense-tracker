import { motion } from "motion/react";
import { Sparkles, AlertCircle, TrendingUp, Info } from "lucide-react";
import { SavingSuggestionCard } from "../components/SavingSuggestionCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useEffect, useRef, useState } from "react";
import api from "../../api";

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
      const now = new Date();
      expenses.forEach((e: any) => {
         const d = new Date(e.date);
         if(d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
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
         let type = "neutral";
         let icon = Sparkles;
         let title = "AI Observation";
         let accentColor = "#F59E0B";

         if(text.includes("overspend") || text.includes("exceeded") || text.includes("Watch out")) {
             type = "warning";
             icon = AlertCircle;
             accentColor = "#F05C47";
             title = "Action Required";
         } else if (text.includes("Great job")) {
             type = "positive";
             icon = TrendingUp;
             accentColor = "#22C08B";
             title = "Positive Trend";
         } else if (text.includes("stable")) {
             icon = Info;
             accentColor = "#5B4EE8";
             title = "Stable Spending";
         }

         return { id: i, type, icon, title, description: text, accentColor };
      });

      setInsights(parsedInsights);
      
      // Simulated saving suggestions based on predictions vs this month
      const suggestions = processedPredictions
         .filter(p => p.thisMonth > p.nextMonth)
         .map((p, i) => ({
            id: i,
            text: `You spent ${p.thisMonth} on ${p.category} this month. Aim for the predicted ${p.nextMonth} next month.`,
            saving: "₹" + (p.thisMonth - p.nextMonth).toFixed(2) + " potential savings"
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="font-semibold" style={{ fontSize: "28px" }}>
            AI Insights
          </h1>
        </div>
        <p className="text-muted-foreground">Here's what your spending tells us this month</p>
      </motion.div>

      {/* Insight Cards */}
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

      {/* Next Month Prediction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-card rounded-2xl p-6 shadow-sm"
      >
        <h3 className="font-semibold mb-6">Next Month Prediction</h3>
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
            <Bar dataKey="thisMonth" fill="#C7D2FE" name="This Month" radius={[8, 8, 0, 0]} />
            <Bar dataKey="nextMonth" fill="#5B4EE8" name="Predicted Next Month" radius={[8, 8, 0, 0]} />
          </BarChart>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">Not enough data for predictions.</div>
          )}
        </ResponsiveContainer>
      </motion.div>

      {/* Saving Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="space-y-4"
      >
        <h3 className="font-semibold">Saving Suggestions</h3>
        <div className="space-y-3">
          {savingSuggestions.length > 0 ? savingSuggestions.map((suggestion, index) => (
            <SavingSuggestionCard
              key={suggestion.id}
              text={suggestion.text}
              saving={suggestion.saving}
              delay={0.6 + index * 0.1}
            />
          )) : (
            <p className="text-muted-foreground">No current spending anomalies to suggest savings on.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}