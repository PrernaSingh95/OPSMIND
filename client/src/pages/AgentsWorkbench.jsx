import React, { useState } from 'react';
import { 
  Bot, 
  BookOpen, 
  Search, 
  Scale, 
  ShieldAlert, 
  Zap, 
  Mail, 
  ChevronRight, 
  CheckCircle2, 
  Code2, 
  Sliders, 
  Terminal, 
  Lock,
  Cpu,
  Layers
} from 'lucide-react';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';

const AGENTS = [
  {
    id: 'understanding',
    name: 'Understanding & Triage Agent',
    step: '1. Ingestion & Entity Extraction',
    icon: Bot,
    color: 'emerald',
    role: 'Deconstructs raw customer or employee tickets into structured intents, urgency levels, sentiment, and entity keys (Order ID, Payment ID, User ID).',
    systemPrompt: 'You are the OpsMind Understanding Agent. Extract structured JSON containing intent, priority, sentiment, extracted entities (orderId, paymentId, customerId), and recommended category.',
    inputs: ['Raw ticket text', 'Channel metadata', 'Customer profile info'],
    outputs: ['intent: string', 'urgency: Low|Medium|High', 'entities: Object', 'category: string'],
    guardrails: ['Never guess entities if absent', 'Strip PII before passing downstream', 'Strict JSON schema enforcement']
  },
  {
    id: 'rag',
    name: 'RAG Knowledge Retrieval Agent',
    step: '2. Policy Grounding & SOP Extraction',
    icon: BookOpen,
    color: 'blue',
    role: 'Performs semantic vector and keyword search across enterprise refund policies, cancellation SOPs, and escalation guidelines to provide verified grounding context.',
    systemPrompt: 'You are the OpsMind RAG Knowledge Agent. Given the case intent, retrieve relevant SOP chunks with similarity confidence and highlight applicable rules.',
    inputs: ['Extracted intent', 'Case category', 'Customer tier'],
    outputs: ['retrievedPolicies: Array', 'applicableRules: Array', 'maxRefundLimit: Number', 'confidenceScore: Float'],
    guardrails: ['Only retrieve approved documents', 'Discard matches below 0.60 similarity threshold', 'Cite specific document and clause IDs']
  },
  {
    id: 'investigation',
    name: 'Investigation Agent (Tool Ledger)',
    step: '3. Multi-Tool Verification & State Fetch',
    icon: Search,
    color: 'indigo',
    role: 'Interacts with mock business systems (Order Management System, Payment Gateway, CRM) to audit transactional truth without hallucination.',
    systemPrompt: 'You are the OpsMind Investigation Agent. Call tools: getOrderDetails, getPaymentStatus, getCustomerHistory. Compile unified verified evidence ledger.',
    inputs: ['Extracted orderId', 'paymentId', 'customerId'],
    outputs: ['orderState: string', 'paymentStatus: string', 'amountDeducted: Number', 'verifiedDiscrepancy: Boolean'],
    guardrails: ['Tools are the single source of truth', 'Never assume payment state without gateway confirmation', 'Flag transactional discrepancies']
  },
  {
    id: 'decision',
    name: 'Decision Reasoning Agent',
    step: '4. Evidence Synthesis & Policy Application',
    icon: Scale,
    color: 'purple',
    role: 'Synthesizes the verified investigation evidence with the retrieved SOP policies to form an explainable decision, proposed action, and confidence rating.',
    systemPrompt: 'You are the OpsMind Decision Agent. Combine verified tool evidence and retrieved policy. Synthesize a deterministic, auditable decision recommendation.',
    inputs: ['Investigation tool outputs', 'Retrieved SOP policies', 'Customer history'],
    outputs: ['decision: string', 'rationale: string', 'recommendedAction: string', 'confidence: Float'],
    guardrails: ['Every decision must cite both tool evidence and SOP clause', 'Never make financial promises beyond policy limits', 'Transparent reasoning chain']
  },
  {
    id: 'risk',
    name: 'Risk Check & Governance Agent',
    step: '5. Autonomous Threshold & HITL Gate',
    icon: ShieldAlert,
    color: 'amber',
    role: 'Evaluates the proposed action against financial limits, fraud risk score, and compliance rules to decide whether to Auto-Execute or Escalate to Human Manager.',
    systemPrompt: 'You are the OpsMind Risk Check Agent. Evaluate financial amount, fraud indicators, customer tier. Determine if action is Low-Risk (Auto-Execute) or High-Risk (Escalate).',
    inputs: ['Proposed action', 'Disbursement amount', 'Customer fraud score', 'Confidence'],
    outputs: ['riskLevel: Low|Medium|High', 'requiresApproval: Boolean', 'riskFactors: Array'],
    guardrails: ['Refunds > $150 strictly require human approval', 'Escalate if customer account flagged', 'Strict separation of duties']
  },
  {
    id: 'action',
    name: 'Action Execution Agent',
    step: '6. Automated Remedy Orchestrator',
    icon: Zap,
    color: 'rose',
    role: 'Dispatches API mutations to trigger automated refunds, re-order creation, inventory unlock, or queue human-in-the-loop escalation tickets.',
    systemPrompt: 'You are the OpsMind Action Agent. Safely execute approved automated actions or dispatch ticket to manager approval queue.',
    inputs: ['Approved decision', 'Target system API payload', 'Authorization token'],
    outputs: ['executionStatus: Success|PendingApproval|Failed', 'transactionRef: string', 'executedAt: ISO8601'],
    guardrails: ['Idempotency keys on all financial mutations', 'Rollback on failure', 'Complete audit log generation']
  },
  {
    id: 'communication',
    name: 'Communication Agent',
    step: '7. Customer-Safe Response Synthesis',
    icon: Mail,
    color: 'cyan',
    role: 'Drafts empathetic, clear, professional responses for the customer that communicate the resolution without exposing internal reasoning, system logs, or raw prompt instructions.',
    systemPrompt: 'You are the OpsMind Communication Agent. Write an empathetic, customer-friendly email/chat message summarizing the resolution and next steps. Do not leak internal system details.',
    inputs: ['Case outcome', 'Action executed/pending', 'Customer name', 'Order ref'],
    outputs: ['draftMessage: string', 'subjectLine: string', 'tone: string', 'channel: string'],
    guardrails: ['Never expose internal prompt logic or backend error codes', 'Empathetic tone matching company brand guidelines', 'Include explicit timeline for bank credit']
  }
];

export default function AgentsWorkbench() {
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">AI Agents Architecture Workbench</h1>
            <SimulatedDataBadge />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Deep-dive into the 7 specialized autonomous agents powering OpsMind AI's business operations pipeline.
          </p>
        </div>
      </div>

      {/* Agents Grid Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
        {AGENTS.map((agent) => {
          const Icon = agent.icon;
          const isSelected = selectedAgent.id === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected 
                  ? 'bg-emerald-500/15 border-emerald-500/60 shadow-lg shadow-emerald-950/30' 
                  : 'bg-gray-900/50 border-gray-800 hover:border-gray-700 text-gray-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-gray-400'}`} />
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
              </div>
              <div className="text-[11px] font-bold text-white line-clamp-1">{agent.name}</div>
              <div className="text-[9px] text-gray-400 line-clamp-1 mt-0.5">{agent.step}</div>
            </button>
          );
        })}
      </div>

      {/* Active Agent Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Agent Core Specification */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Agent Header Card */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <selectedAgent.icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    {selectedAgent.step}
                  </span>
                  <h2 className="text-lg font-bold text-white">{selectedAgent.name}</h2>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-900 border border-gray-700 text-[11px] text-emerald-300 font-mono">
                <Cpu className="w-3.5 h-3.5" />
                <span>Deterministic Structured Output</span>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed bg-gray-900/60 p-4 rounded-xl border border-gray-800/80">
              {selectedAgent.role}
            </p>
          </div>

          {/* System Prompt Archetype */}
          <div className="glass-panel p-5 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                System Prompt Archetype
              </h3>
              <span className="text-[10px] text-gray-400 font-mono">Temperature: 0.1 (Strict Precision)</span>
            </div>
            <pre className="p-3.5 bg-black/50 rounded-lg border border-gray-800 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">
              {selectedAgent.systemPrompt}
            </pre>
          </div>

          {/* I/O Contracts Specification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Inputs */}
            <div className="glass-panel p-5 rounded-xl border border-gray-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" />
                Input Payload Schema
              </h3>
              <ul className="space-y-2">
                {selectedAgent.inputs.map((inp, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                    <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                    <span>{inp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Outputs */}
            <div className="glass-panel p-5 rounded-xl border border-gray-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Output Schema (JSON)
              </h3>
              <ul className="space-y-2">
                {selectedAgent.outputs.map((out, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-emerald-300 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Safety Guardrails & Governance */}
        <div className="space-y-6">
          
          <div className="glass-panel p-5 rounded-xl border border-amber-500/30 bg-amber-950/10">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Agent Safety Guardrails
            </h3>
            <ul className="space-y-2.5">
              {selectedAgent.guardrails.map((g, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-amber-100/90 leading-relaxed">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-gray-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Runtime Orchestration
            </h3>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="p-3 bg-gray-900/60 rounded-lg border border-gray-800">
                <div className="text-gray-400 text-[10px]">Zero-API Key Fallback</div>
                <div className="text-white font-semibold mt-0.5">Deterministic Mock Agent Engine</div>
              </div>
              <div className="p-3 bg-gray-900/60 rounded-lg border border-gray-800">
                <div className="text-gray-400 text-[10px]">Production Mode</div>
                <div className="text-emerald-400 font-semibold mt-0.5">Gemini 1.5 Pro / GPT-4o</div>
              </div>
              <div className="p-3 bg-gray-900/60 rounded-lg border border-gray-800">
                <div className="text-gray-400 text-[10px]">Audit Level</div>
                <div className="text-white font-semibold mt-0.5">100% Granular Agent Traceability</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
