import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Zap, 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  DollarSign, 
  Sparkles, 
  ArrowUpRight, 
  RefreshCw, 
  FolderKanban 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import MetricCard from '../components/common/MetricCard';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { analyticsAPI, casesAPI } from '../services/api';

export const Dashboard = ({ onOpenIntake }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, casesRes] = await Promise.all([
        analyticsAPI.getAnalytics(),
        casesAPI.getAll({ limit: 5 })
      ]);
      setAnalyticsData(analyticsRes.data.data || {});
      setRecentCases(casesRes.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      // Populate demo fallback metrics so the user always sees a beautiful, responsive dashboard
      setAnalyticsData({
        kpis: {
          totalCases: 128,
          aiResolvedCases: 110,
          humanEscalations: 18,
          resolutionRate: '85.9%',
          escalationRate: '14.1%',
          avgResolutionTime: '1.4 sec',
          workflowSuccessRate: '98.6%',
          avgGroundedness: '97.8%',
          avgLatency: '1.42s',
          avgCostPerCase: '$0.0038'
        },
        workloadTrends: [
          { day: 'Mon', aiResolved: 16, humanEscalated: 2 },
          { day: 'Tue', aiResolved: 21, humanEscalated: 3 },
          { day: 'Wed', aiResolved: 28, humanEscalated: 4 },
          { day: 'Thu', aiResolved: 25, humanEscalated: 3 },
          { day: 'Fri', aiResolved: 31, humanEscalated: 4 },
          { day: 'Sat', aiResolved: 19, humanEscalated: 3 },
          { day: 'Sun', aiResolved: 13, humanEscalated: 2 }
        ],
        categoryStats: [
          { name: 'Cancellation & Refund', count: 58, percentage: 45 },
          { name: 'Billing & Payments', count: 38, percentage: 30 },
          { name: 'Orders & Logistics', count: 20, percentage: 15 },
          { name: 'Technical Support', count: 12, percentage: 10 }
        ],
        agentPerformance: [
          { name: 'Understanding Agent', role: 'Intent & Entity Triage', accuracy: '98.5%', latency: '240ms', groundedness: '97.2%', status: 'Optimal' },
          { name: 'RAG Knowledge Agent', role: 'SOP & Policy Grounding', accuracy: '96.8%', latency: '180ms', groundedness: '98.4%', status: 'Optimal' },
          { name: 'Investigation Agent', role: 'OMS & Gateway Reconciliation', accuracy: '99.1%', latency: '340ms', groundedness: '99.0%', status: 'Optimal' },
          { name: 'Decision Agent', role: 'Deterministic Evidence Synthesis', accuracy: '97.4%', latency: '290ms', groundedness: '98.1%', status: 'Optimal' },
          { name: 'Risk Check Agent', role: 'Threshold Guardrails & HITL', accuracy: '99.4%', latency: '110ms', groundedness: '99.5%', status: 'Optimal' },
          { name: 'Communication Agent', role: 'Customer Safe Drafts', accuracy: '99.0%', latency: '250ms', groundedness: '98.8%', status: 'Optimal' }
        ]
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const defaultKpis = {
    totalCases: 128,
    aiResolvedCases: 110,
    humanEscalations: 18,
    resolutionRate: '85.9%',
    escalationRate: '14.1%',
    avgResolutionTime: '1.4 sec',
    workflowSuccessRate: '98.6%',
    avgGroundedness: '97.8%',
    avgLatency: '1.42s',
    avgCostPerCase: '$0.0038'
  };

  const kpis = analyticsData?.kpis || defaultKpis;
  const workloadTrends = analyticsData?.workloadTrends || [
    { day: 'Mon', aiResolved: 16, humanEscalated: 2 },
    { day: 'Tue', aiResolved: 21, humanEscalated: 3 },
    { day: 'Wed', aiResolved: 28, humanEscalated: 4 },
    { day: 'Thu', aiResolved: 25, humanEscalated: 3 },
    { day: 'Fri', aiResolved: 31, humanEscalated: 4 },
    { day: 'Sat', aiResolved: 19, humanEscalated: 3 },
    { day: 'Sun', aiResolved: 13, humanEscalated: 2 }
  ];
  const categoryStats = analyticsData?.categoryStats || [
    { name: 'Cancellation & Refund', count: 58, percentage: 45 },
    { name: 'Billing & Payments', count: 38, percentage: 30 },
    { name: 'Orders & Logistics', count: 20, percentage: 15 },
    { name: 'Technical Support', count: 12, percentage: 10 }
  ];
  const agentPerformance = analyticsData?.agentPerformance || [
    { name: 'Understanding Agent', role: 'Intent & Entity Triage', accuracy: '98.5%', latency: '240ms', groundedness: '97.2%', status: 'Optimal' },
    { name: 'RAG Knowledge Agent', role: 'SOP & Policy Grounding', accuracy: '96.8%', latency: '180ms', groundedness: '98.4%', status: 'Optimal' },
    { name: 'Investigation Agent', role: 'OMS & Gateway Reconciliation', accuracy: '99.1%', latency: '340ms', groundedness: '99.0%', status: 'Optimal' },
    { name: 'Decision Agent', role: 'Deterministic Evidence Synthesis', accuracy: '97.4%', latency: '290ms', groundedness: '98.1%', status: 'Optimal' },
    { name: 'Risk Check Agent', role: 'Threshold Guardrails & HITL', accuracy: '99.4%', latency: '110ms', groundedness: '99.5%', status: 'Optimal' },
    { name: 'Communication Agent', role: 'Customer Safe Drafts', accuracy: '99.0%', latency: '250ms', groundedness: '98.8%', status: 'Optimal' }
  ];


  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner: Operations Overview + Demo Disclaimer */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-gray-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
              Autonomous Operations Overview
            </h1>
            <SimulatedDataBadge text="Simulated Demo Data" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Real-time agentic workflow telemetry, cross-system investigation results, and human-in-the-loop governance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={onOpenIntake}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg shadow-md hover:shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Case Intake</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Cases Handled"
          value={kpis.totalCases}
          subtitle="All ingested operational cases"
          icon={FolderKanban}
          color="blue"
          isPositive={true}
          change="+14.2%"
        />
        <MetricCard
          title="Autonomous AI Resolved"
          value={kpis.aiResolvedCases}
          subtitle={`${kpis.resolutionRate} autonomous resolution`}
          icon={Bot}
          color="emerald"
          isPositive={true}
          change="+8.6%"
        />
        <MetricCard
          title="Human Escalations (HITL)"
          value={kpis.humanEscalations}
          subtitle="Safety thresholds triggered"
          icon={AlertTriangle}
          color="amber"
          isPositive={false}
          change="-3.1%"
        />
        <MetricCard
          title="Avg Resolution Time"
          value={kpis.avgResolutionTime}
          subtitle="Versus 180 min manual SOPs"
          icon={Clock}
          color="purple"
          isPositive={true}
          change="99.2% faster"
        />
      </div>

      {/* Secondary Performance Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-gray-800 text-center">
          <span className="text-[11px] font-semibold text-gray-400 uppercase">Workflow Success</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">{kpis.workflowSuccessRate}</div>
        </div>
        <div className="glass-card p-4 rounded-xl border border-gray-800 text-center">
          <span className="text-[11px] font-semibold text-gray-400 uppercase">Groundedness Score</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">{kpis.avgGroundedness}</div>
        </div>
        <div className="glass-card p-4 rounded-xl border border-gray-800 text-center">
          <span className="text-[11px] font-semibold text-gray-400 uppercase">Avg Pipeline Latency</span>
          <div className="text-xl font-mono font-bold text-white mt-1">{kpis.avgLatency}</div>
        </div>
        <div className="glass-card p-4 rounded-xl border border-gray-800 text-center">
          <span className="text-[11px] font-semibold text-gray-400 uppercase">Estimated Cost / Case</span>
          <div className="text-xl font-mono font-bold text-teal-300 mt-1">{kpis.avgCostPerCase}</div>
        </div>
      </div>

      {/* Charts Section: Workload Trends & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workload Trends Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Weekly Workload Volume</h3>
                <SimulatedDataBadge size="xs" text="Demo Data" />
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Autonomous resolution vs human escalations</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> AI Resolved
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Human Escalated
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={workloadTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="aiColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="humanColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="aiResolved" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#aiColor)" name="AI Resolved" />
                <Area type="monotone" dataKey="humanEscalated" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#humanColor)" name="Human Escalated" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Operational Categories</h3>
              <SimulatedDataBadge size="xs" text="Demo Data" />
            </div>
            <p className="text-xs text-gray-400 mb-4">Distribution across intake classes</p>

            <div className="space-y-3">
              {categoryStats?.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-300">{cat.name}</span>
                    <span className="font-mono text-gray-400">{cat.count} cases ({cat.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-teal-500' : idx === 2 ? 'bg-cyan-500' : 'bg-gray-600'
                      }`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800 text-[11px] text-gray-400 flex items-center justify-between">
            <span>Primary Driver: Cancellation & Refund</span>
            <span className="text-emerald-400 font-semibold">45% Volume</span>
          </div>
        </div>
      </div>

      {/* Agent Performance Breakdown Table */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Agent Performance & Quality Benchmark</h3>
              <SimulatedDataBadge size="xs" text="Demo Data" />
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Telemetry across all 7 logical agent modules</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
            All 7 Agents Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-900/80 text-gray-400 uppercase font-semibold border-y border-gray-800">
              <tr>
                <th className="px-4 py-3">Logical Agent</th>
                <th className="px-4 py-3">Accuracy / Success</th>
                <th className="px-4 py-3">Avg Latency</th>
                <th className="px-4 py-3">Estimated Cost / Op</th>
                <th className="px-4 py-3">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium text-gray-200">
              {agentPerformance?.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                    <Bot className="w-3.5 h-3.5 text-emerald-400" />
                    {item.agent}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-400">{item.accuracy}%</td>
                  <td className="px-4 py-3 font-mono text-gray-300">{item.latencyMs} ms</td>
                  <td className="px-4 py-3 font-mono text-gray-400">{item.costPerOp}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Operations Cases */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Operational Cases</h3>
            <p className="text-xs text-gray-400 mt-0.5">Live cases in autonomous processing or approval queues</p>
          </div>
          <button
            onClick={() => navigate('/cases')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Cases</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {recentCases.map((c) => (
            <div
              key={c._id}
              onClick={() => navigate(`/cases/${c._id}`)}
              className="glass-card p-4 rounded-xl border border-gray-800 hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                    {c.caseNumber}
                  </span>
                  <StatusBadge status={c.status} />
                  <PriorityBadge priority={c.priority} />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {c.title}
                </h4>
                <div className="text-[11px] text-gray-400 flex items-center gap-3">
                  <span>Customer: {c.customer?.name}</span>
                  {c.orderId && <span>Order: {c.orderId}</span>}
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-[11px] font-mono text-gray-400">
                  Step: <strong className="text-emerald-400">{c.workflowState?.currentStep}</strong>
                </span>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
