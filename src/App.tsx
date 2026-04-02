import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowRight, 
  ShieldCheck,
  GraduationCap
} from "lucide-react";
import Background from "./components/Background";
import Toast from "./components/Toast";
import ForgotPasswordModal from "./components/ForgotPasswordModal";
import Sidebar from "./components/Sidebar";
import DashboardContent from "./components/DashboardContent";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; visible: boolean }>({
    message: "",
    type: "success",
    visible: false,
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (email === "admin@gmail.com" && password === "Admin@123") {
      setIsSuccess(true);
      showToast("Login successful! Redirecting to dashboard...", "success");
      
      // Transition to dashboard after success animation
      setTimeout(() => {
        setIsLoggedIn(true);
        setIsSuccess(false);
        setIsLoading(false);
      }, 1500);
    } else {
      showToast("Invalid credentials. Please try again.", "error");
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("admin@gmail.com");
    setPassword("Admin@123");
    showToast("Logged out successfully.", "success");
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex bg-aquire-grey-light overflow-hidden">
        <Sidebar 
          onLogout={handleLogout} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        <main className="flex-1 h-screen overflow-y-auto custom-scrollbar z-10">
          <DashboardContent activeTab={activeTab} showToast={showToast} />
        </main>
        <Toast 
          message={toast.message} 
          type={toast.type} 
          isVisible={toast.visible} 
          onClose={() => setToast(prev => ({ ...prev, visible: false }))}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-aquire-black">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-aquire-primary/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-aquire-primary/10 blur-[120px] rounded-full" />
      </div>
      
      <AnimatePresence>
        {!isSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-lg z-10"
          >
            {/* Logo Section */}
            <div className="text-center mb-10">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-white/5 backdrop-blur-md rounded-3xl mb-6 shadow-xl border border-white/10"
              >
                <GraduationCap className="w-12 h-12 text-aquire-primary" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
                Aquire <span className="text-aquire-primary">Academy</span>
              </h1>
              <p className="text-white/40 font-medium tracking-widest uppercase text-xs">
                Empowering Learners
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-[#1E293B]/50 backdrop-blur-xl rounded-[40px] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="relative">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-white mb-2">Admin Panel Login</h2>
                  <p className="text-white/50">Welcome back! Please sign in to your account.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-8">
                  {/* Email Input */}
                  <div className="space-y-2 group">
                    <label className="block text-sm font-semibold text-white/70 ml-1 transition-colors group-focus-within:text-aquire-primary">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-aquire-primary transition-colors" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@gmail.com"
                        className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-lg focus:border-aquire-primary focus:ring-4 focus:ring-aquire-primary/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2 group">
                    <div className="flex items-center justify-between px-1">
                      <label className="block text-sm font-semibold text-white/70 transition-colors group-focus-within:text-aquire-primary">
                        Password
                      </label>
                      <button 
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="text-xs font-bold text-aquire-primary hover:text-white transition-colors uppercase tracking-wider"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-aquire-primary transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-14 pr-14 py-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-lg focus:border-aquire-primary focus:ring-4 focus:ring-aquire-primary/10 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-5 bg-aquire-primary text-white font-bold text-lg rounded-2xl shadow-2xl shadow-aquire-primary/20 hover:bg-aquire-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 group"
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                {/* Demo Badge */}
                <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <ShieldCheck className="w-4 h-4 text-aquire-primary" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
                      Demo: admin@gmail.com / Admin@123
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center z-10"
          >
            <div className="w-24 h-24 bg-aquire-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-aquire-primary/30">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
              >
                <ShieldCheck className="w-12 h-12 text-aquire-primary" />
              </motion.div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Access Granted</h2>
            <p className="text-white/60 text-lg max-w-xs mx-auto">
              Redirecting you to the Aquire Academy Admin Dashboard...
            </p>
            <div className="mt-12 flex justify-center">
              <Loader2 className="w-8 h-8 text-aquire-primary animate-spin" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-white/30 text-xs font-medium tracking-widest uppercase z-10">
        <div className="flex items-center justify-center gap-6 mb-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Help Center</a>
        </div>
        <p>© 2026 Aquire Academy. All rights reserved.</p>
      </footer>

      <ForgotPasswordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.visible} 
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
