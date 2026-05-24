import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogOut, User, Mail, Calendar, Shield, Zap, Clock } from 'lucide-react';

export const DashboardPage = () => {
  const { user, logout, logoutAll, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const handleLogoutAll = async () => {
    if (!window.confirm('Are you sure? This will logout all your sessions.')) {
      return;
    }
    try {
      await logoutAll();
      toast.success('Logged out from all sessions');
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4 mx-auto"></div>
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10">
        {/* Header */}
        <nav className="bg-slate-800/30 backdrop-blur-xl border-b border-slate-700/50 px-6 py-4 sticky top-0">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all border border-red-500/30 hover:border-red-500/50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          
          {/* Welcome Card */}
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl mb-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                  <span className="text-lg">👋</span> Welcome back,
                </p>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  {user?.username}
                </h2>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${user?.verified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                <Shield className="w-4 h-4" />
                <span className="font-semibold">{user?.verified ? 'Verified' : 'Unverified'}</span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Email</p>
                </div>
                <p className="text-lg text-slate-100 break-all font-mono">{user?.email}</p>
              </div>

              <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50 hover:border-pink-500/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-pink-400" />
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">User ID</p>
                </div>
                <p className="text-lg text-slate-100 font-mono break-all">{user?.id}</p>
              </div>

              <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Member Since</p>
                </div>
                <p className="text-lg text-slate-100">{new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>

              <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Last Updated</p>
                </div>
                <p className="text-lg text-slate-100">{new Date(user?.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>

          {/* Session Management Card */}
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl font-bold text-white">Session Management</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={handleLogout}
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold transition-all transform hover:scale-105 shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout Current Session
              </button>

              <button
                onClick={handleLogoutAll}
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold transition-all transform hover:scale-105 shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Logout All Sessions
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-slate-400 text-sm">
            <p>🔒 Your account is secure with end-to-end encryption</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;