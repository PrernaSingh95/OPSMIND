import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Bot, 
  Cpu, 
  ShieldCheck, 
  LogOut, 
  Bell, 
  Search, 
  User,
  Sparkles
} from 'lucide-react';

export const Navbar = ({ onOpenIntake }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-gray-800 bg-[#0B0F19]/80 backdrop-blur-md px-6 flex items-center justify-between">
      {/* Search / Global Context Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search cases, policies, order IDs, or audit logs (e.g. ORDER-1001)..."
            className="w-full bg-gray-900/80 border border-gray-800 rounded-lg pl-10 pr-4 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right Controls: AI Engine Status + Quick Intake + User Profile */}
      <div className="flex items-center gap-4">
        {/* Quick Case Intake Button */}
        {onOpenIntake && (
          <button
            onClick={onOpenIntake}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-lg shadow-md hover:shadow-emerald-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Case Intake</span>
          </button>
        )}

        {/* AI Engine Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-full text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-gray-300 font-medium">OpsMind AI Core:</span>
          <span className="text-emerald-400 font-semibold uppercase">Active (Autonomous)</span>
        </div>

        {/* Role Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-800/90 border border-gray-700 text-xs font-medium text-gray-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{user?.role || 'Employee'}</span>
        </div>

        {/* User profile & Logout */}
        <div className="flex items-center gap-3 pl-2 border-l border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-white leading-tight">{user?.name}</div>
              <div className="text-[10px] text-gray-400">{user?.email}</div>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign out of OpsMind"
            className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
