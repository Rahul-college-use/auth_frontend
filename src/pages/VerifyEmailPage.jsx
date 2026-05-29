import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Shield, RefreshCw, ArrowRight, Clock } from "lucide-react";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const { verifyEmail, requestOTP } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((p) => p - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      toast.error("Email and OTP required");
      return;
    }

    setSubmitting(true);

    try {
      const res = await verifyEmail(email, otp);

      toast.success(res.message || "Verified");

      setTimeout(() => {
        navigate("/login");
      }, 100000);

    } catch (err) {
      toast.error(err.message || "Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestOTP = async () => {
    if (!email) return toast.error("Email required");

    setRequesting(true);

    try {
      await requestOTP(email);
      toast.success("OTP sent");
      setCooldown(60);
    } catch (err) {
      toast.error(err.message || "Failed");
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>

          <h2 className="text-white text-3xl font-bold text-center mb-2">
            Verify Email
          </h2>
          <p className="text-slate-400 text-center mb-8">Enter the 6-digit OTP sent to your email</p>

          <form onSubmit={handleVerify} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 text-white border border-slate-700/50 rounded-lg placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
              />
            </div>

            {/* OTP Input */}
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
                maxLength={6}
                placeholder="000000"
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 text-white border border-slate-700/50 rounded-lg placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-center tracking-widest font-bold text-lg"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
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

          {/* Resend OTP */}
          <button
            onClick={handleRequestOTP}
            disabled={requesting || cooldown > 0}
            className="w-full mt-4 text-amber-400 hover:text-amber-300 text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {requesting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Sending OTP...
              </>
            ) : cooldown > 0 ? (
              <>
                <Clock className="w-4 h-4" />
                Resend OTP ({cooldown}s)
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Resend OTP
              </>
            )}
          </button>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
            <p className="text-slate-400 text-xs text-center">
              🔒 Your email is secured with OTP verification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}