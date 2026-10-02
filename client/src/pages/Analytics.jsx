import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Users, 
  PieChart as PieIcon,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { analyticsAPI } from '../services/api';
import MetricCard from '../components/common/MetricCard';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsAPI.getAnalytics();
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Computing Platform Intelligence & Operations Telemetry..." />;
  }

  // Fallback defaults for rich rendering
  const metrics = data?.metrics || {
    totalCases: 142,
    autonomousRate: 84.5,
    escalationRate: 15.5,
    avgResolutionTimeSeconds: 2.1,
    manualTimeSavedHours: 420,
    costSavingsUsd: 8400
  };

  const trendData = data?.trendData || [
    { date: 'Mon', total: 18, auto: 16, escalated: 2 },
    { date: 'Tue', total: 24, auto: 20, escalated: 4 },
    { date: 'Wed', total: 32, auto: 28, escalated: 4 },
    { date: 'Thu', total: 28, auto: 24, escalated: 4 },
    { date: 'Fri', total: 35, auto: 29, escalated: 6 },
    { date: 'Sat', total: 22, auto: 19, escalated: 3 },
    { date: 'Sun', total: 15, auto: 13, escalated: 2 }
  ];

  const categoryDistribution = data?.categoryDistribution || [
    { name: 'Billing & Payments', value: 58 },
    { name: 'Orders & Logistics', value: 34 },
    { name: 'Product & Returns', value: 26 },
    { name: 'Account & Security', value: 14 },
    { name: 'General Inquiries', value: 10 }
  ];

  const agentLatencyData = [
    { name: 'Understanding', latencyMs: 220 },
    { name: 'RAG Retrieval', latencyMs: 180 },
    { name: 'Tool Ledger', latencyMs: 340 },
    { name: 'Decision Engine', latencyMs: 290 },
    { name: 'Risk Scoring', latencyMs: 110 },
    { name: 'Communication', latencyMs: 250 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">Operations Analytics & Intelligence</h1>
            <SimulatedDataBadge />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Real-time throughput, autonomous resolution efficiency, and agent latency benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAnalytics}
            className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition"
            title="Refresh Analytics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Cases Processed"
          value={metrics.totalCases}
          change="+18% this week"
          trend="up"
          icon={TrendingUp}
        />
        <MetricCard
          title="Autonomous Resolution"
          value={`${metrics.autonomousRate}%`}
          change="Zero human touch"
          trend="up"
          icon={Zap}
        />
        <MetricCard
          title="Avg AI Resolution Time"
          value={`${metrics.avgResolutionTimeSeconds}s`}
          change="vs 4.2h manual SLA"
          trend="up"
          icon={Clock}
        />
        <MetricCard
          title="Estimated Value Saved"
          value={`$${metrics.costSavingsUsd.toLocaleString()}`}
          change="Simulated Demo ROI"
          trend="up"
          icon={DollarSign}
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Daily Throughput Area Chart (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Autonomous vs Escalated Volume Trend
              </h3>
              <p className="text-[11px] text-gray-400">Daily intake load segmented by resolution pathway</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Autonomous
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Escalated (HITL)
              </span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorAuto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEsc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={11} />
                <YAxis stroke="#6B7280" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="auto" stroke="#10B981" fillOpacity={1} fill="url(#colorAuto)" />
                <Area type="monotone" dataKey="escalated" stroke="#F59E0B" fillOpacity={1} fill="url(#colorEsc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Distribution Pie (1 Col) */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Workload by Domain Category
            </h3>
            <p className="text-[11px] text-gray-400">Breakdown of ingested operations tickets</p>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.75rem', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-xs">
            {categoryDistribution.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-gray-300">{cat.name}</span>
                </div>
                <span className="font-mono font-semibold text-white">{cat.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Agent Latency Row */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Agent Execution Latency Benchmark (ms)
            </h3>
            <p className="text-[11px] text-gray-400">Step-by-step pipeline execution duration per agent</p>
          </div>
          <span className="text-xs text-emerald-400 font-mono">Total Pipeline SLA: ~1.4s</span>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={agentLatencyData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis type="number" stroke="#6B7280" fontSize={11} unit="ms" />
              <YAxis dataKey="name" type="category" stroke="#6B7280" fontSize={11} width={100} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.75rem', fontSize: '11px' }} />
              <Bar dataKey="latencyMs" fill="#10B981" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
