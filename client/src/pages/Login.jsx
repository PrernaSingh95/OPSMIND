import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error('Login error', err);
      setError(err.response?.data?.message || 'Invalid email or password credentials');
      setLoading(false);
    }
  };

  const handleDemoFill = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
    try {
      setLoading(true);
      await login(demoEmail, demoPass);
      navigate('/');
    } catch (err) {
      console.error('Demo login error', err);
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#080B14] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 shadow-xl shadow-emerald-500/20 mb-3">
          <Layers className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">OpsMind AI</h1>
        <p className="text-xs text-gray-400 mt-1 max-w-sm">
          Autonomous Business Operations Intelligence & Multi-Agent Orchestration Platform
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-gray-800 shadow-2xl relative z-10">
        <h2 className="text-lg font-bold text-white mb-1">Sign in to Operations Portal</h2>
        <p className="text-xs text-gray-400 mb-6">Enter your credentials or choose a preloaded demo role</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@opsmind.ai"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <span>Authenticating...</span> : (
              <>
                <span>Access Operations Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Preset Selectors */}
        <div className="mt-6 pt-6 border-t border-gray-800/80">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3 text-center">
            ⚡ Quick-Login with Seeded Demo Roles:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('admin@opsmind.ai', 'Admin@123')}
              className="p-2 rounded-lg bg-gray-900/90 hover:bg-gray-800 border border-gray-800 hover:border-emerald-500/50 text-left transition-all group"
            >
              <div className="text-[11px] font-bold text-emerald-400 group-hover:text-emerald-300">Admin</div>
              <div className="text-[9px] text-gray-400 truncate">admin@opsmind.ai</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('manager@opsmind.ai', 'Manager@123')}
              className="p-2 rounded-lg bg-gray-900/90 hover:bg-gray-800 border border-gray-800 hover:border-emerald-500/50 text-left transition-all group"
            >
              <div className="text-[11px] font-bold text-cyan-400 group-hover:text-cyan-300">Manager</div>
              <div className="text-[9px] text-gray-400 truncate">manager@opsmind.ai</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('employee@opsmind.ai', 'Employee@123')}
              className="p-2 rounded-lg bg-gray-900/90 hover:bg-gray-800 border border-gray-800 hover:border-emerald-500/50 text-left transition-all group"
            >
              <div className="text-[11px] font-bold text-teal-400 group-hover:text-teal-300">Employee</div>
              <div className="text-[9px] text-gray-400 truncate">employee@opsmind.ai</div>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          Need a new profile?{' '}
          <Link to="/register" className="text-emerald-400 hover:underline font-semibold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
