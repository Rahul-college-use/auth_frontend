import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, Shield, ArrowRight, RefreshCw } from "lucide-react";

export const LoginPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const [cooldown, setCooldown] = useState(0);
  const [showOTP, setShowOTP] = useState(false);

  const { login, verifyEmail, requestOTP } = useAuth();

  const navigate = useNavigate();

    if (localStorage.getItem("accessToken")) {
    // console.log("Access token found on login page, redirecting to dashboard");
    return navigate("/dashboard");
  }
  useEffect(() => {
    let interval;
    if (cooldown > 0) {
      interval = setInterval(() => setCooldown((p) => p - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await login(email, password);

      const { accessToken, user } = res;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      if (user?.verified) {
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.info("Please verify OTP");
        setShowOTP(true);
        setCooldown(60);
      }
    } catch (err) {
      toast.error(err.message || "Login failed");
      // console.error("Login error:", err);
      
    } finally {
      setSubmitting(false);
    }
  };

  // VERIFY OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp) return toast.error("Please enter OTP");

    setSubmitting(true);

    try {
      const res = await verifyEmail(email, otp);

      if (res?.user) {
        toast.success("Email verified successfully");
        setShowOTP(false);
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.message || "OTP verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  // RESEND OTP
  const handleRequestOTP = async () => {
    if (!email) return toast.error("Enter email first");

    setRequesting(true);

    try {
      await requestOTP(email);
      toast.success("OTP sent");
      setCooldown(60);
    } catch (err) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setRequesting(false);
    }
  };

  // ================= OTP SCREEN =================
  if (showOTP) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-12 relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="max-w-md w-full relative z-10">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>

            <h2 className="text-white text-2xl font-bold text-center mb-2">
              Verify Email
            </h2>
            <p className="text-slate-400 text-center mb-6 text-sm">Enter the 6-digit OTP sent to your email</p>

            <form onSubmit={handleVerifyOTP}>
              <input
                type="text"
                value={otp}
                maxLength={6}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
                placeholder="000000"
                className="w-full p-4 mb-4 bg-slate-800/50 text-white border border-cyan-500/30 rounded-lg text-center tracking-widest font-bold text-2xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
              />

              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold p-4 rounded-lg flex items-center justify-center gap-2 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Email
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <button
              onClick={handleRequestOTP}
              disabled={requesting || cooldown > 0}
              className="w-full mt-4 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition disabled:opacity-50"
            >
              {requesting
                ? "Sending..."
                : cooldown > 0
                ? `Resend OTP (${cooldown}s)`
                : "Resend OTP"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= LOGIN SCREEN =================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-12 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl">
          
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>

          <h1 className="text-white text-3xl font-bold text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-center mb-8">Sign in to your account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 text-white border border-slate-700/50 rounded-lg placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 text-white border border-slate-700/50 rounded-lg placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <p className="text-center text-slate-400 text-sm">
              No account?{" "}
              <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;