import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import api from "../../api";

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (isLogin) {
        const { data } = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", data.access_token);
        navigate("/");
      } else {
        await api.post("/auth/register", { email, password });
        setIsLogin(true);
        setError("Account created successfully. Please login.");
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card shadow-2xl rounded-3xl p-8 border border-border">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">₹</span>
            </div>
            <h1 className="text-2xl font-semibold mb-2">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? "Enter your details to access your dashboard." : "Start tracking your finances smartly."}
            </p>
          </div>

          {error && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${error.includes('successfully') ? 'bg-secondary/10 text-secondary' : 'bg-destructive/10 text-destructive'}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Processing..." : (isLogin ? "Sign In" : "Register")}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
