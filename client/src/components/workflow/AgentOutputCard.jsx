import React, { useState } from 'react';
import { 
  Bot, 
  BookOpen, 
  Search, 
  Scale, 
  ShieldAlert, 
  Zap, 
  Mail, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Copy, 
  Check 
} from 'lucide-react';
import EvidenceViewer from './EvidenceViewer';

export const AgentOutputCard = ({ currentCase, activeTab, onApprovalAction }) => {
  const [copied, setCopied] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [simulatedSent, setSimulatedSent] = useState(currentCase?.communicationResult?.isSimulatedSent || false);

  const {
    understandingResult = {},
    ragResult = {},
    investigationResult = {},
    decisionResult = {},
    riskCheckResult = {},
    actionResult = {},
    communicationResult = {},
    approvalInfo = {}
  } = currentCase || {};

  const handleSimulatedSend = async () => {
    try {
      setSendingEmail(true);
      setSimulatedSent(true);
      setTimeout(() => {
        setSendingEmail(false);
      }, 500);
    } catch (err) {
      console.error('Failed to send simulated email', err);
      setSendingEmail(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800">
      {/* 1. Intake Summary */}
      {activeTab === 'Intake' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
            <Bot className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Case Intake & Triage Metadata</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="glass-card p-4 rounded-xl border border-gray-800 space-y-2">
              <span className="text-gray-400 font-medium">Customer Information</span>
              <div className="text-sm font-semibold text-white">{currentCase?.customer?.name}</div>
              <div className="text-gray-400">{currentCase?.customer?.email}</div>
              <div className="text-[11px] font-mono text-emerald-400">ID: {currentCase?.customer?.customerId || 'CUST-1001'}</div>
            </div>
            <div className="glass-card p-4 rounded-xl border border-gray-800 space-y-2">
              <span className="text-gray-400 font-medium">Case Parameters</span>
              <div className="flex justify-between">
                <span className="text-gray-400">Order Reference:</span>
                <span className="font-mono font-bold text-white">{currentCase?.orderId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Reference:</span>
                <span className="font-mono font-bold text-white">{currentCase?.paymentId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Priority:</span>
                <span className="font-semibold text-amber-400">{currentCase?.priority}</span>
              </div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-gray-800">
            <span className="text-xs font-semibold text-gray-400">Customer Description:</span>
            <p className="mt-1 text-sm text-gray-200 leading-relaxed font-sans">{currentCase?.description}</p>
          </div>
        </div>
      )}

      {/* 2. Understanding Agent */}
      {activeTab === 'Understanding' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Understanding Agent Telemetry</h3>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono">
              Confidence: {Math.round((understandingResult.confidence || 0.96) * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="glass-card p-3.5 rounded-xl border border-gray-800">
              <span className="text-[11px] text-gray-400 font-semibold uppercase">Extracted Intent</span>
              <div className="text-xs font-bold text-white mt-1 leading-snug">
                {understandingResult.intent || 'Payment Deducted on Cancelled Order'}
              </div>
            </div>
            <div className="glass-card p-3.5 rounded-xl border border-gray-800">
              <span className="text-[11px] text-gray-400 font-semibold uppercase">Urgency & Sentiment</span>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-semibold border border-orange-500/30">
                  {understandingResult.urgency || 'High'}
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30">
                  {understandingResult.sentiment || 'Negative'}
                </span>
              </div>
            </div>
            <div className="glass-card p-3.5 rounded-xl border border-gray-800">
              <span className="text-[11px] text-gray-400 font-semibold uppercase">Suggested Category</span>
              <div className="text-xs font-bold text-emerald-400 mt-1">
                {understandingResult.suggestedCategory || currentCase?.category}
              </div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl border border-gray-800 space-y-2">
            <span className="text-xs font-semibold text-gray-400">Extracted System Entities:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2 bg-gray-900 rounded border border-gray-800">
                <div className="text-[10px] text-gray-400">Order ID</div>
                <div className="text-emerald-400 font-bold">{understandingResult.extractedEntities?.orderId || currentCase?.orderId}</div>
              </div>
              <div className="p-2 bg-gray-900 rounded border border-gray-800">
                <div className="text-[10px] text-gray-400">Payment ID</div>
                <div className="text-emerald-400 font-bold">{understandingResult.extractedEntities?.paymentId || currentCase?.paymentId}</div>
              </div>
              <div className="p-2 bg-gray-900 rounded border border-gray-800">
                <div className="text-[10px] text-gray-400">Amount</div>
                <div className="text-white font-bold">${understandingResult.extractedEntities?.amount || 129.99}</div>
              </div>
              <div className="p-2 bg-gray-900 rounded border border-gray-800">
                <div className="text-[10px] text-gray-400">Issue Pattern</div>
                <div className="text-amber-400 font-bold text-[11px] truncate">{understandingResult.extractedEntities?.issueType || 'Cancellation Inconsistency'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. RAG Knowledge Agent */}
      {activeTab === 'KnowledgeRetrieval' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">RAG Knowledge Base Citations</h3>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono">
              Grounding Source: {ragResult.policyReference || 'POL-REF-01'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Primary Applied Policy</div>
            <div className="text-sm font-semibold text-white mt-0.5">
              {ragResult.appliedPolicy || 'Customer Refund Policy & Financial Remediation'}
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Retrieved Policy Clauses & Excerpts:</span>
            {(ragResult.retrievedDocuments || []).map((doc, idx) => (
              <div key={idx} className="glass-card p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{doc.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                      {doc.policyCode}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    Relevance: {doc.relevanceScore}%
                  </span>
                </div>
                <p className="text-xs text-gray-300 bg-gray-900/80 p-3 rounded-lg border border-gray-800/80 leading-relaxed font-sans italic">
                  "{doc.relevantExcerpt}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Investigation Agent */}
      {activeTab === 'Investigation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Investigation Agent & Tool Ledgers</h3>
            </div>
          </div>
          <EvidenceViewer investigationResult={investigationResult} />
        </div>
      )}

      {/* 5. Decision Agent */}
      {activeTab === 'Decision' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Decision Agent Synthesis</h3>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono">
              Certainty: {Math.round((decisionResult.confidence || 0.98) * 100)}%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-gray-900 border border-emerald-500/40">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Formal Decision</span>
            <div className="text-base font-bold text-white mt-1">
              {decisionResult.decision || 'Full Refund Authorized & Eligible'}
            </div>
            <p className="text-xs text-gray-300 mt-2 leading-relaxed">
              <strong className="text-emerald-400">Recommendation: </strong>
              {decisionResult.recommendation}
            </p>
          </div>

          <div className="glass-card p-4 rounded-xl border border-gray-800 space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Grounding Evidence Chain:</span>
            <ul className="space-y-2 text-xs text-gray-200">
              {(decisionResult.evidencePoints || []).map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-gray-900 border border-gray-800 text-xs text-gray-400">
            <span className="font-semibold text-gray-300">Policy Compliance Statement: </span>
            {decisionResult.policyComplianceStatement}
          </div>
        </div>
      )}

      {/* 6. Risk Check Agent */}
      {activeTab === 'RiskCheck' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Risk Check & Governance Scoring</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="glass-card p-4 rounded-xl border border-gray-800">
              <span className="text-xs text-gray-400 font-semibold uppercase">Risk Classification</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">
                {riskCheckResult.riskLevel || 'Low'}
              </div>
            </div>
            <div className="glass-card p-4 rounded-xl border border-gray-800">
              <span className="text-xs text-gray-400 font-semibold uppercase">Calculated Risk Score</span>
              <div className="text-xl font-mono font-bold text-white mt-1">
                {riskCheckResult.riskScore || 18} <span className="text-xs text-gray-400 font-normal">/ 100</span>
              </div>
            </div>
            <div className="glass-card p-4 rounded-xl border border-gray-800">
              <span className="text-xs text-gray-400 font-semibold uppercase">Execution Governance</span>
              <div className="text-xs font-bold mt-2">
                {riskCheckResult.requiresApproval ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Human Approval Required
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Autonomous Auto-Execution
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl border border-gray-800 space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Evaluated Risk Factors:</span>
            <ul className="space-y-1.5 text-xs text-gray-300">
              {(riskCheckResult.riskFactors || []).map((factor, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 7. Action / Human Approval */}
      {activeTab === 'HumanApproval' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Action Execution & Human-in-the-Loop</h3>
            </div>
            <span className="text-xs font-mono bg-gray-800 text-gray-300 px-2.5 py-0.5 rounded-full border border-gray-700">
              Mock Sandbox Action
            </span>
          </div>

          {riskCheckResult.requiresApproval && approvalInfo.status === 'PENDING' ? (
            <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-200 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                <span>Human-In-The-Loop Sign-off Required</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                Autonomous execution is held in accordance with safety principles. A human Operations Manager must review evidence and authorize remediation.
              </p>
              {onApprovalAction && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => onApprovalAction('APPROVED')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-all shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve & Execute Sandbox Remedy
                  </button>
                  <button
                    onClick={() => onApprovalAction('REJECTED')}
                    className="px-4 py-2 bg-rose-600/80 hover:bg-rose-500 text-white font-semibold text-xs rounded-lg transition-all"
                  >
                    Reject Proposed Action
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-5 rounded-xl border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Action Execution Summary</span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                  {actionResult.actionStatus || 'EXECUTED'}
                </span>
              </div>
              <p className="text-xs text-gray-200 leading-relaxed font-mono bg-gray-900/90 p-3 rounded-lg border border-gray-800">
                {actionResult.actionSummary || '[Mock/Sandbox Action] Processed 100% refund of $129.99 to original card via Mock PG Gateway.'}
              </p>
              {actionResult.mockTransactionRef && (
                <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                  <span>Mock Gateway Reference:</span>
                  <span className="font-mono font-bold text-white">{actionResult.mockTransactionRef}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 8. Communication Agent */}
      {activeTab === 'Communication' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Grounded Communication Draft</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(communicationResult.body || '')}
                className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-gray-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleSimulatedSend}
                disabled={sendingEmail || simulatedSent}
                className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all ${
                  simulatedSent
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sendingEmail ? 'Sending...' : simulatedSent ? 'Simulated Sent ✓' : 'Send Simulated Email'}</span>
              </button>
            </div>
          </div>

          <div className="glass-card p-5 rounded-xl border border-gray-800 space-y-3">
            <div className="space-y-1 text-xs pb-3 border-b border-gray-800">
              <div className="flex">
                <span className="w-20 text-gray-400">To:</span>
                <span className="font-semibold text-white">{communicationResult.recipientEmail || currentCase?.customer?.email}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-gray-400">Subject:</span>
                <span className="font-semibold text-white">{communicationResult.subject}</span>
              </div>
            </div>

            <div className="text-xs text-gray-200 leading-relaxed whitespace-pre-line font-sans bg-gray-900/60 p-4 rounded-lg border border-gray-800/80">
              {communicationResult.body}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-gray-900/90 rounded-lg border border-gray-800 space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase">Verified Facts Embedded</span>
              <ul className="space-y-1 text-gray-300">
                {(communicationResult.verifiedFactsUsed || []).map((fact, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-3 bg-gray-900/90 rounded-lg border border-gray-800 space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase">Approved Policy Reference</span>
              <ul className="space-y-1 text-gray-300">
                {(communicationResult.policyCitations || []).map((cite, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{cite}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentOutputCard;
