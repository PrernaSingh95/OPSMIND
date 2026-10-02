import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  Bot,
  CheckSquare,
  Sliders,
  BarChart3,
  ScrollText,
  Settings,
  Cpu,
  Layers
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/cases', label: 'Cases', icon: FolderKanban },
    { to: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
    { to: '/agents', label: 'Agents', icon: Bot },
    { to: '/approvals', label: 'Approvals', icon: CheckSquare },
    { to: '/prompts-evaluation', label: 'Prompts & Evaluation', icon: Sliders },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/audit-logs', label: 'Audit Logs', icon: ScrollText },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0D121F] border-r border-gray-800 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-gray-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight text-white">OpsMind</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">AI</span>
          </div>
          <p className="text-[10px] text-gray-400 font-medium">Operations Platform</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-6 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Operations Core
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* System Engine Footer Badge */}
      <div className="p-4 border-t border-gray-800/80">
        <div className="p-3 rounded-xl bg-gray-900/90 border border-gray-800 text-xs">
          <div className="flex items-center justify-between text-gray-400 font-medium mb-1">
            <span className="flex items-center gap-1.5 text-white font-semibold">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              Agent Workflow
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">v2.4</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Multi-agent architecture with grounded RAG & HITL safeguards.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
