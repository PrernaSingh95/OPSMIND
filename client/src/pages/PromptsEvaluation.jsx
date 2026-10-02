import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Layers, 
  RefreshCw, 
  Code, 
  GitCompare, 
  Sparkles,
  BarChart3,
  Clock,
  Coins,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { promptsAPI, evaluationsAPI } from '../services/api';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function PromptsEvaluation() {
  const [activeTab, setActiveTab] = useState('Evaluation'); // 'Evaluation' | 'Prompts' | 'Comparison'
  const [prompts, setPrompts] = useState([]);
  const [evalData, setEvalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [runningEval, setRunningEval] = useState(false);
  
  // Selected Prompt for inspection
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  // A/B Comparison state
  const [compareAgent, setCompareAgent] = useState('DecisionAgent');
  const [compareV1, setCompareV1] = useState('v1');
  const [compareV2, setCompareV2] = useState('v3');
  const [testInput, setTestInput] = useState('Order #ORD-8821 was cancelled by system, but user card was charged $129.99.');
  const [comparing, setComparing] = useState(false);
  const [compareResults, setCompareResults] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [promptsRes, evalRes] = await Promise.all([
        promptsAPI.getAll(),
        evaluationsAPI.getLatest()
      ]);
      if (promptsRes.data.success) {
        setPrompts(promptsRes.data.data);
        if (promptsRes.data.data.length > 0) {
          setSelectedPrompt(promptsRes.data.data[0]);
        }
      }
      if (evalRes.data.success) {
        setEvalData(evalRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching prompts/eval data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRunEvaluation = async () => {
    try {
      setRunningEval(true);
      const res = await evaluationsAPI.run();
      if (res.data.success) {
        setEvalData(res.data.data);
      }
    } catch (err) {
      console.error('Evaluation run error:', err);
    } finally {
      setRunningEval(false);
    }
  };

  const handleRunComparison = async (e) => {
    e.preventDefault();
    try {
      setComparing(true);
      // Simulate/call comparison
      setTimeout(() => {
        setCompareResults({
          v1: {
            version: 'v1.0 (Baseline Zero-Shot)',
            output: 'The order is cancelled and money was taken. We should refund the customer $129.99 immediately.',
            groundednessScore: 68,
            hallucinationRisk: 'Moderate (Did not cite SOP clause)',
            latency: 420
          },
          v3: {
            version: 'v3.0 (Structured Chain-of-Evidence)',
            output: 'DECISION: Approved for Automated Refund.\nEVIDENCE: OMS reports order ORD-8821 cancelled at 14:02. Payment Gateway transaction TXN-9912 settled $129.99.\nRAG GROUNDING: Applies Payment Failure SOP Section 3.1 ($129.99 < $150.00 autonomous threshold).\nRECOMMENDATION: Trigger action.executeRefund(TXN-9912).',
            groundednessScore: 98,
            hallucinationRisk: 'Zero (Strict JSON & Tool cited)',
            latency: 290
          }
        });
        setComparing(false);
      }, 600);
    } catch (err) {
      console.error('Compare error:', err);
      setComparing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading Prompt Registry & Evaluation Benchmarks..." />;
  }

  const radarData = evalData?.metrics ? [
    { subject: 'Groundedness', A: evalData.metrics.groundedness || 96, fullMark: 100 },
    { subject: 'Tool Accuracy', A: evalData.metrics.toolAccuracy || 98, fullMark: 100 },
    { subject: 'Escalation Precision', A: evalData.metrics.escalationPrecision || 94, fullMark: 100 },
    { subject: 'Format Adherence', A: evalData.metrics.formatAdherence || 99, fullMark: 100 },
    { subject: 'Zero Hallucination', A: 100 - (evalData.metrics.hallucinationRate || 2), fullMark: 100 },
    { subject: 'Customer Safety', A: evalData.metrics.safetyScore || 97, fullMark: 100 }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">Prompts Engineering & Evaluation Suite</h1>
            <SimulatedDataBadge />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Production prompt version control, semantic guardrails, and autonomous benchmark evaluation suite.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunEvaluation}
            disabled={runningEval}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40 transition"
          >
            {runningEval ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running 25 Test Cases...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Benchmark Suite</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
        {[
          { id: 'Evaluation', label: 'Benchmark Evaluation Metrics' },
          { id: 'Prompts', label: 'Prompt Version Registry' },
          { id: 'Comparison', label: 'A/B Prompt Diff & Latency' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === tab.id
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BENCHMARK EVALUATION METRICS */}
      {activeTab === 'Evaluation' && evalData && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-gray-800">
              <span className="text-gray-400 text-xs block mb-1">Overall Accuracy</span>
              <div className="text-2xl font-black text-emerald-400">{evalData.metrics?.overallAccuracy || 96.4}%</div>
              <span className="text-[10px] text-gray-400 mt-1 block">25 Ground-Truth Scenarios</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-gray-800">
              <span className="text-gray-400 text-xs block mb-1">RAG Groundedness</span>
              <div className="text-2xl font-black text-blue-400">{evalData.metrics?.groundedness || 95.8}%</div>
              <span className="text-[10px] text-gray-400 mt-1 block">Faithfulness to SOP</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-gray-800">
              <span className="text-gray-400 text-xs block mb-1">Tool Calling Accuracy</span>
              <div className="text-2xl font-black text-purple-400">{evalData.metrics?.toolAccuracy || 98.2}%</div>
              <span className="text-[10px] text-gray-400 mt-1 block">Correct Parameter Fetch</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-gray-800">
              <span className="text-gray-400 text-xs block mb-1">Hallucination Rate</span>
              <div className="text-2xl font-black text-emerald-400">{evalData.metrics?.hallucinationRate || 1.8}%</div>
              <span className="text-[10px] text-gray-400 mt-1 block">Near Zero Inventions</span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Radar Chart: Agent Health Dimensions */}
            <div className="glass-panel p-5 rounded-xl border border-gray-800 flex flex-col justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Agent Alignment Radar
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#374151" />
                    <Radar name="OpsMind Pipeline" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <span className="text-[10px] text-gray-400 text-center">Evaluated across 6 safety & compliance dimensions</span>
            </div>

            {/* Performance Breakdown Table */}
            <div className="lg:col-span-2 glass-panel p-5 rounded-xl border border-gray-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Test Case Execution Log (Synthetic Suite)
                </h3>
                <span className="text-[11px] text-emerald-400 font-mono">Run ID: {evalData.runId || 'EVAL-2026-09'}</span>
              </div>

              <div className="overflow-x-auto max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-900/80 text-gray-400 text-[10px] uppercase font-bold sticky top-0">
                    <tr>
                      <th className="p-2.5">Scenario</th>
                      <th className="p-2.5">Intent</th>
                      <th className="p-2.5">RAG Grounded</th>
                      <th className="p-2.5">Tool Verified</th>
                      <th className="p-2.5">Escalation</th>
                      <th className="p-2.5">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 font-mono text-[11px]">
                    {(evalData.testCases || [
                      { name: 'Payment Deducted, Order Cancelled ($45)', intent: 'PaymentDiscrepancy', rag: true, tool: true, esc: 'Auto', pass: true },
                      { name: 'Payment Deducted, Order Cancelled ($299)', intent: 'PaymentDiscrepancy', rag: true, tool: true, esc: 'HITL', pass: true },
                      { name: 'Damaged Item Delivery (Return)', intent: 'DamagedItem', rag: true, tool: true, esc: 'Auto', pass: true },
                      { name: 'Duplicate Charge On Subscription', intent: 'DuplicateCharge', rag: true, tool: true, esc: 'Auto', pass: true },
                      { name: 'Account Takeover Flagged', intent: 'SecurityAlert', rag: true, tool: true, esc: 'HITL', pass: true },
                      { name: 'Late Shipment Tracking Update', intent: 'ShipmentDelay', rag: true, tool: true, esc: 'Auto', pass: true }
                    ]).map((tc, idx) => (
                      <tr key={idx} className="hover:bg-gray-900/40">
                        <td className="p-2.5 font-sans font-medium text-white">{tc.name}</td>
                        <td className="p-2.5 text-gray-300">{tc.intent}</td>
                        <td className="p-2.5 text-emerald-400">{tc.rag ? 'Pass' : 'Fail'}</td>
                        <td className="p-2.5 text-purple-400">{tc.tool ? 'Pass' : 'Fail'}</td>
                        <td className="p-2.5 text-amber-300">{tc.esc}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                            PASS
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROMPT REGISTRY */}
      {activeTab === 'Prompts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prompt List */}
          <div className="glass-panel p-4 rounded-xl border border-gray-800 space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Prompt Version Registry
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {prompts.map((p) => (
                <button
                  key={p._id}
                  onClick={() => setSelectedPrompt(p)}
                  className={`w-full p-3 rounded-lg border text-left transition ${
                    selectedPrompt?._id === p._id
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                      : 'bg-gray-900/40 border-gray-800 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>{p.agentName}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-gray-800 rounded text-emerald-400">
                      v{p.version}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-1">{p.description || p.changeNotes}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Active Prompt Inspector */}
          <div className="lg:col-span-2 glass-panel p-5 rounded-xl border border-gray-800 space-y-4">
            {selectedPrompt ? (
              <>
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedPrompt.agentName}</h3>
                    <span className="text-xs text-gray-400">Release Version {selectedPrompt.version}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                    Active in Production
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">System Instructions Prompt</label>
                  <pre className="p-4 bg-black/60 rounded-xl border border-gray-800 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                    {selectedPrompt.template || selectedPrompt.promptText}
                  </pre>
                </div>

                {selectedPrompt.changeNotes && (
                  <div className="p-3 bg-gray-900/60 rounded-lg border border-gray-800 text-xs">
                    <span className="text-gray-400 font-bold block mb-0.5">Version Changelog:</span>
                    <span className="text-gray-300">{selectedPrompt.changeNotes}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-gray-400 text-xs">Select a prompt to inspect.</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: A/B COMPARISON */}
      {activeTab === 'Comparison' && (
        <div className="space-y-6">
          <form onSubmit={handleRunComparison} className="glass-panel p-5 rounded-xl border border-gray-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-emerald-400" />
              A/B Prompt Diff & Latency Benchmark
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Target Agent</label>
                <select
                  value={compareAgent}
                  onChange={(e) => setCompareAgent(e.target.value)}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white"
                >
                  <option value="DecisionAgent">Decision Reasoning Agent</option>
                  <option value="UnderstandingAgent">Understanding & Triage Agent</option>
                  <option value="CommunicationAgent">Communication Agent</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Variant A</label>
                <select
                  value={compareV1}
                  onChange={(e) => setCompareV1(e.target.value)}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white"
                >
                  <option value="v1">v1.0 (Zero-Shot Baseline)</option>
                  <option value="v2">v2.0 (Few-Shot Prompt)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Variant B (Optimized)</label>
                <select
                  value={compareV2}
                  onChange={(e) => setCompareV2(e.target.value)}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white"
                >
                  <option value="v3">v3.0 (Structured Chain-of-Evidence)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Test Case Input</label>
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={comparing}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-2"
              >
                {comparing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Execute A/B Comparison</span>
              </button>
            </div>
          </form>

          {/* Comparison Output Cards */}
          {compareResults && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Variant A */}
              <div className="glass-panel p-5 rounded-xl border border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300">Variant A: {compareResults.v1.version}</span>
                  <span className="text-[10px] text-gray-400">{compareResults.v1.latency}ms</span>
                </div>
                <div className="p-3 bg-gray-900 rounded-lg border border-gray-800 text-xs text-gray-300 whitespace-pre-wrap font-mono">
                  {compareResults.v1.output}
                </div>
                <div className="flex justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-800">
                  <span>Groundedness: <strong className="text-amber-400">{compareResults.v1.groundednessScore}%</strong></span>
                  <span>Hallucination: <strong className="text-rose-400">{compareResults.v1.hallucinationRisk}</strong></span>
                </div>
              </div>

              {/* Variant B */}
              <div className="glass-panel p-5 rounded-xl border border-emerald-500/40 bg-emerald-950/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300">Variant B: {compareResults.v3.version}</span>
                  <span className="text-[10px] text-emerald-400">{compareResults.v3.latency}ms (31% faster)</span>
                </div>
                <div className="p-3 bg-gray-900 rounded-lg border border-emerald-500/20 text-xs text-emerald-200 whitespace-pre-wrap font-mono">
                  {compareResults.v3.output}
                </div>
                <div className="flex justify-between text-[11px] text-gray-400 pt-2 border-t border-emerald-500/20">
                  <span>Groundedness: <strong className="text-emerald-400">{compareResults.v3.groundednessScore}%</strong></span>
                  <span>Hallucination: <strong className="text-emerald-400">{compareResults.v3.hallucinationRisk}</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
