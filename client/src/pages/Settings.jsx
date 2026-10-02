import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Cpu, 
  Database, 
  Key, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Activity, 
  Layers, 
  Sliders,
  Server,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toolsAPI } from '../services/api';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';

export default function Settings() {
  const { user } = useAuth();
  const [aiMode, setAiMode] = useState('mock');
  const [sandboxStatus, setSandboxStatus] = useState(null);
  const [loadingSandbox, setLoadingSandbox] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchSandbox = async () => {
    try {
      setLoadingSandbox(true);
      const res = await toolsAPI.getSandboxStatus();
      if (res.data.success) {
        setSandboxStatus(res.data.data);
      }
    } catch (err) {
      console.error('Sandbox status error:', err);
    } finally {
      setLoadingSandbox(false);
    }
  };

  useEffect(() => {
    fetchSandbox();
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">System Settings & Mock Sandbox</h1>
            <SimulatedDataBadge />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Configure agent runtime engines, mock enterprise connectors, and role security.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <span>Settings successfully saved and synchronized.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: AI Engine & Threshold Config */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Orchestration Engine */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">AI Inference Engine</h2>
                <p className="text-xs text-gray-400">Switch between zero-API key deterministic fallback mode and live LLM</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAiMode('mock')}
                className={`p-4 rounded-xl border text-left transition ${
                  aiMode === 'mock'
                    ? 'bg-emerald-500/15 border-emerald-500/60 text-white shadow-lg'
                    : 'bg-gray-900/40 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">Deterministic Mock Mode</span>
                  {aiMode === 'mock' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Zero external API key required. Employs deterministic regex, rule-based parsing, and simulated RAG vectors.
                </p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                  Recommended for Demos & Testing
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAiMode('real')}
                className={`p-4 rounded-xl border text-left transition ${
                  aiMode === 'real'
                    ? 'bg-purple-500/15 border-purple-500/60 text-white shadow-lg'
                    : 'bg-gray-900/40 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">Live LLM Provider</span>
                  {aiMode === 'real' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Connects to Gemini 1.5 Pro or OpenAI GPT-4o for live non-deterministic multi-agent reasoning.
                </p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono">
                  Requires Server GEMINI_API_KEY
                </span>
              </button>
            </div>
          </div>

          {/* Autonomous Risk Thresholds */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Autonomous Action & Financial Thresholds
            </h2>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-gray-900/60 rounded-xl border border-gray-800 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">Max Auto-Refund Limit</div>
                  <div className="text-gray-400 text-[11px]">Amounts exceeding this value trigger Human Approval (HITL)</div>
                </div>
                <span className="font-mono text-emerald-400 font-bold text-sm bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-700">
                  $150.00 USD
                </span>
              </div>

              <div className="p-3.5 bg-gray-900/60 rounded-xl border border-gray-800 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">RAG Confidence Threshold</div>
                  <div className="text-gray-400 text-[11px]">Minimum cosine similarity required to ground decisions</div>
                </div>
                <span className="font-mono text-emerald-400 font-bold text-sm bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-700">
                  0.65
                </span>
              </div>

              <div className="p-3.5 bg-gray-900/60 rounded-xl border border-gray-800 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">Customer Fraud Score Gate</div>
                  <div className="text-gray-400 text-[11px]">Flagged accounts automatically route to senior fraud team</div>
                </div>
                <span className="font-mono text-amber-400 font-bold text-sm bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-700">
                  Score &gt; 40
                </span>
              </div>
            </div>
          </div>

          {/* Mock Business Sandbox Inventory */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                Mock Business Tool Sandbox Inventory
              </h2>
              <button
                onClick={fetchSandbox}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingSandbox ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-gray-900/80 rounded-xl border border-gray-800">
                <span className="text-gray-400 text-[10px] block uppercase font-bold">Mock Orders</span>
                <span className="text-lg font-bold text-white mt-1 block">
                  {sandboxStatus?.ordersCount || 12} records
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">ORD-9821, ORD-7712...</span>
              </div>

              <div className="p-3 bg-gray-900/80 rounded-xl border border-gray-800">
                <span className="text-gray-400 text-[10px] block uppercase font-bold">Mock Payments</span>
                <span className="text-lg font-bold text-white mt-1 block">
                  {sandboxStatus?.paymentsCount || 15} records
                </span>
                <span className="text-[10px] text-purple-400 font-mono">TXN-4921, TXN-8812...</span>
              </div>

              <div className="p-3 bg-gray-900/80 rounded-xl border border-gray-800">
                <span className="text-gray-400 text-[10px] block uppercase font-bold">Mock Customers</span>
                <span className="text-lg font-bold text-white mt-1 block">
                  {sandboxStatus?.customersCount || 8} records
                </span>
                <span className="text-[10px] text-blue-400 font-mono">CUST-104, CUST-202...</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Col: User RBAC Profile & System Telemetry */}
        <div className="space-y-6">
          
          {/* User RBAC Profile */}
          <div className="glass-panel p-5 rounded-xl border border-gray-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              Authenticated Session
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-800/60">
                <span className="text-gray-400">Name</span>
                <span className="text-white font-medium">{user?.name || 'Administrator'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-800/60">
                <span className="text-gray-400">Email</span>
                <span className="text-white font-mono text-[11px]">{user?.email || 'admin@opsmind.ai'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-800/60">
                <span className="text-gray-400">RBAC Role</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  {user?.role || 'Admin'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-400">Permissions</span>
                <span className="text-gray-300">All (Full Agent Governance)</span>
              </div>
            </div>
          </div>

          {/* System Environment */}
          <div className="glass-panel p-5 rounded-xl border border-gray-800 space-y-3 text-xs">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              Environment Specs
            </h3>

            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Stack</span>
                <span className="text-white font-medium">React + Vite / Node Express</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Database</span>
                <span className="text-white font-medium">MongoDB (Memory / Atlas)</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Security</span>
                <span className="text-white font-medium">JWT + bcrypt Auth</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Agent Framework</span>
                <span className="text-emerald-400 font-medium">OpsMind Orchestrator v2.4</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
