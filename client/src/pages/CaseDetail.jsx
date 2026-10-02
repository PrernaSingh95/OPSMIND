import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Bot, 
  Scale, 
  Mail, 
  FileText, 
  Activity, 
  Send,
  AlertTriangle,
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { casesAPI, approvalsAPI, communicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import WorkflowStepper from '../components/workflow/WorkflowStepper';
import EvidenceViewer from '../components/workflow/EvidenceViewer';
import AgentOutputCard from '../components/workflow/AgentOutputCard';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [decidingApproval, setDecidingApproval] = useState(false);
  const [commSending, setCommSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchCase = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await casesAPI.getById(id);
      if (res.data.success) {
        setCaseData(res.data.data);
      } else {
        setErrorMsg('Failed to load case details');
      }
    } catch (err) {
      console.error('Error fetching case:', err);
      setErrorMsg(err.response?.data?.message || 'Error loading case details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [id]);

  const handleRunWorkflow = async () => {
    try {
      setProcessing(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      const res = await casesAPI.processWorkflow(id);
      if (res.data.success) {
        setCaseData(res.data.data.case);
        setSuccessMsg('Autonomous Agent Workflow completed successfully!');
      }
    } catch (err) {
      console.error('Workflow error:', err);
      setErrorMsg(err.response?.data?.message || 'Agent workflow execution failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleApprovalDecision = async (decision) => {
    const approvalId = caseData.approvalRecord?._id || caseData.approvalId || caseData.approvalInfo?.approvalId?._id || caseData.approvalInfo?.approvalId;
    if (!approvalId) {
      setErrorMsg('No active approval record found for this case.');
      return;
    }

    try {
      setDecidingApproval(true);
      setErrorMsg(null);
      const res = await approvalsAPI.decide(approvalId, decision, approvalNotes);
      if (res.data.success) {
        setSuccessMsg(`Approval decision '${decision}' executed successfully.`);
        fetchCase();
      }
    } catch (err) {
      console.error('Approval decision error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit approval decision');
    } finally {
      setDecidingApproval(false);
    }
  };

  const handleSendSimulatedComm = async (commId) => {
    try {
      setCommSending(true);
      const res = await communicationsAPI.sendSimulated(commId);
      if (res.data.success) {
        setSuccessMsg('Customer email simulated & logged to dispatch queue.');
        fetchCase();
      }
    } catch (err) {
      console.error('Comm send error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to dispatch communication');
    } finally {
      setCommSending(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading Case Intelligence Dossier..." />;
  }

  if (errorMsg && !caseData) {
    return (
      <div className="glass-panel p-8 text-center rounded-2xl border border-rose-500/30 max-w-xl mx-auto my-12">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Case Not Found</h2>
        <p className="text-sm text-gray-400 mb-6">{errorMsg}</p>
        <button
          onClick={() => navigate('/cases')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition"
        >
          Back to Cases
        </button>
      </div>
    );
  }

  const {
    caseNumber,
    title,
    description,
    status,
    priority,
    category,
    source,
    customer = {},
    workflowState = {},
    understandingResult = {},
    ragResult = {},
    investigationResult = {},
    decisionResult = {},
    riskCheckResult = {},
    actionResult = {},
    communicationResult = {},
    approvalRecord,
    auditTrail = []
  } = caseData || {};

  const isEscalated = status === 'Escalated' || riskCheckResult.requiresApproval;
  const canApprove = ['Admin', 'Manager'].includes(user?.role);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/cases"
            className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold">{caseNumber}</span>
              <StatusBadge status={status} />
              <PriorityBadge priority={priority} />
              <SimulatedDataBadge />
            </div>
            <h1 className="text-xl font-bold text-white mt-1">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCase}
            className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition"
            title="Refresh Dossier"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleRunWorkflow}
            disabled={processing}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-950/40 transition"
          >
            {processing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Orchestrating Agents...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{workflowState.completedSteps?.length > 0 ? 'Re-Run Pipeline' : 'Run Agent Pipeline'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-xs underline font-semibold">Dismiss</button>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-xs underline font-semibold">Dismiss</button>
        </div>
      )}

      {/* Workflow Stepper Navigation */}
      <WorkflowStepper
        workflowState={workflowState}
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        riskCheckResult={riskCheckResult}
      />

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Step / Intelligence Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Sub Navigation Bar */}
          <div className="flex items-center gap-2 border-b border-gray-800 pb-2 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'Overview', label: 'Overview & Evidence' },
              { id: 'Understanding', label: '1. Understanding' },
              { id: 'KnowledgeRetrieval', label: '2. RAG Knowledge' },
              { id: 'Investigation', label: '3. Investigation' },
              { id: 'Decision', label: '4. Decision & Risk' },
              { id: 'Communication', label: '5. Communication' },
              { id: 'AuditTrail', label: '6. Audit Trail' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW & EVIDENCE */}
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              {/* Case Summary Card */}
              <div className="glass-panel p-5 rounded-xl border border-gray-800">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Case Description & Intake Payload
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed bg-gray-900/50 p-4 rounded-lg border border-gray-800/80 font-mono text-xs">
                  {description}
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                  <div className="bg-gray-900/40 p-2.5 rounded-lg border border-gray-800/60">
                    <span className="text-gray-400 block text-[10px]">Category</span>
                    <span className="text-white font-semibold">{category || 'General'}</span>
                  </div>
                  <div className="bg-gray-900/40 p-2.5 rounded-lg border border-gray-800/60">
                    <span className="text-gray-400 block text-[10px]">Source Channel</span>
                    <span className="text-white font-semibold">{source || 'Web Portal'}</span>
                  </div>
                  <div className="bg-gray-900/40 p-2.5 rounded-lg border border-gray-800/60">
                    <span className="text-gray-400 block text-[10px]">Risk Level</span>
                    <span className={`font-semibold ${
                      riskCheckResult.riskLevel === 'Low' ? 'text-emerald-400' :
                      riskCheckResult.riskLevel === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {riskCheckResult.riskLevel || 'Pending Evaluation'}
                    </span>
                  </div>
                  <div className="bg-gray-900/40 p-2.5 rounded-lg border border-gray-800/60">
                    <span className="text-gray-400 block text-[10px]">Auto Executed</span>
                    <span className="text-white font-semibold">{actionResult.executed ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {/* Comprehensive Evidence Ledger Viewer */}
              <EvidenceViewer
                investigationResult={investigationResult}
                ragResult={ragResult}
                decisionResult={decisionResult}
                riskCheckResult={riskCheckResult}
              />
            </div>
          )}

          {/* TAB 2: UNDERSTANDING AGENT */}
          {activeTab === 'Understanding' && (
            <AgentOutputCard
              agentName="Understanding Agent"
              step="Understanding"
              data={understandingResult}
              icon={Bot}
              color="indigo"
            />
          )}

          {/* TAB 3: RAG KNOWLEDGE AGENT */}
          {activeTab === 'KnowledgeRetrieval' && (
            <AgentOutputCard
              agentName="RAG Knowledge Agent"
              step="KnowledgeRetrieval"
              data={ragResult}
              icon={FileText}
              color="blue"
            />
          )}

          {/* TAB 4: INVESTIGATION AGENT */}
          {activeTab === 'Investigation' && (
            <AgentOutputCard
              agentName="Investigation Agent"
              step="Investigation"
              data={investigationResult}
              icon={Activity}
              color="emerald"
            />
          )}

          {/* TAB 5: DECISION & RISK AGENT */}
          {activeTab === 'Decision' && (
            <div className="space-y-6">
              <AgentOutputCard
                agentName="Decision Agent"
                step="Decision"
                data={decisionResult}
                icon={Scale}
                color="purple"
              />
              <AgentOutputCard
                agentName="Risk Check Agent"
                step="RiskCheck"
                data={riskCheckResult}
                icon={ShieldAlert}
                color="amber"
              />
            </div>
          )}

          {/* TAB 6: COMMUNICATION AGENT */}
          {activeTab === 'Communication' && (
            <div className="space-y-6">
              <AgentOutputCard
                agentName="Communication Agent"
                step="Communication"
                data={communicationResult}
                icon={Mail}
                color="cyan"
              />

              {/* Customer Safe Preview Card */}
              {communicationResult.draftMessage && (
                <div className="glass-panel p-5 rounded-xl border border-cyan-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Client-Facing Communication Box
                    </span>
                    <span className="text-[10px] text-gray-400">Tone: {communicationResult.tone || 'Empathetic & Professional'}</span>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-gray-900/90 border border-gray-800 text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {communicationResult.draftMessage}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Target: <span className="text-white font-medium">{customer.email || 'customer@example.com'}</span>
                    </span>
                    <button
                      onClick={() => handleSendSimulatedComm(caseData.communicationId || id)}
                      disabled={commSending}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {commSending ? 'Dispatching...' : 'Dispatch Simulated Response'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: AUDIT TRAIL */}
          {activeTab === 'AuditTrail' && (
            <div className="glass-panel p-5 rounded-xl border border-gray-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Case Lifecycle Telemetry Ledger
              </h3>
              {auditTrail && auditTrail.length > 0 ? (
                <div className="space-y-3">
                  {auditTrail.map((log, index) => (
                    <div key={index} className="p-3 bg-gray-900/60 rounded-lg border border-gray-800 flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-white">{log.action || log.event}</span>
                          <span className="text-[10px] text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{log.details || log.description || JSON.stringify(log)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-6">No audit records logged yet for this case.</p>
              )}
            </div>
          )}

        </div>

        {/* Right 1 Col: Customer & Human-in-the-Loop Review Box */}
        <div className="space-y-6">

          {/* Human-in-the-Loop Review Box */}
          {isEscalated && (
            <div className="glass-panel p-5 rounded-xl border-2 border-amber-500/40 bg-amber-950/10 shadow-xl shadow-amber-950/20">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
                Human Approval Required
              </div>
              <p className="text-xs text-amber-200/80 mb-4">
                This case exceeds the autonomous threshold (Risk: <span className="font-bold text-amber-300">{riskCheckResult.riskLevel}</span>). Review the recommended action below.
              </p>

              <div className="p-3 bg-gray-900/80 rounded-lg border border-amber-500/20 mb-4 text-xs space-y-1.5">
                <div className="text-gray-400">Proposed Action:</div>
                <div className="text-emerald-300 font-bold">{decisionResult.recommendedAction || 'Process Refund & Notify'}</div>
                <div className="text-gray-400 mt-2">Risk Factor:</div>
                <div className="text-rose-300 font-medium">{riskCheckResult.riskFactors?.join(', ') || 'Financial Disbursement Threshold'}</div>
              </div>

              {canApprove ? (
                <div className="space-y-3">
                  <textarea
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    placeholder="Enter reviewer notes or reason for decision..."
                    className="w-full h-20 p-2.5 bg-gray-900/90 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleApprovalDecision('Approved')}
                      disabled={decidingApproval}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve Action
                    </button>
                    <button
                      onClick={() => handleApprovalDecision('Rejected')}
                      disabled={decidingApproval}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-900/50 rounded-lg text-center text-xs text-gray-400">
                  Manager or Admin role required to approve.
                </div>
              )}
            </div>
          )}

          {/* Customer Metadata Card */}
          <div className="glass-panel p-5 rounded-xl border border-gray-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              Customer Profile
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-800/60">
                <span className="text-gray-400">Name</span>
                <span className="text-white font-medium">{customer.name || 'Anonymous User'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-800/60">
                <span className="text-gray-400">Email</span>
                <span className="text-white font-medium">{customer.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-800/60">
                <span className="text-gray-400">Customer Tier</span>
                <span className="text-emerald-400 font-bold">{customer.tier || 'Standard'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-800/60">
                <span className="text-gray-400">Lifetime Orders</span>
                <span className="text-white font-medium">{customer.orderCount || '4'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-400">Risk Profile</span>
                <span className="text-emerald-400 font-medium">Low Fraud History</span>
              </div>
            </div>
          </div>

          {/* Pipeline Quick Links */}
          <div className="glass-panel p-5 rounded-xl border border-gray-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Linked Platform Artifacts
            </h3>
            <div className="space-y-2 text-xs">
              <Link
                to="/knowledge"
                className="flex items-center justify-between p-2.5 rounded-lg bg-gray-900/50 hover:bg-gray-900 text-gray-300 hover:text-emerald-400 border border-gray-800/60 transition"
              >
                <span>RAG Grounding Policies</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/agents"
                className="flex items-center justify-between p-2.5 rounded-lg bg-gray-900/50 hover:bg-gray-900 text-gray-300 hover:text-emerald-400 border border-gray-800/60 transition"
              >
                <span>Agent Architecture Schemas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/audit-logs"
                className="flex items-center justify-between p-2.5 rounded-lg bg-gray-900/50 hover:bg-gray-900 text-gray-300 hover:text-emerald-400 border border-gray-800/60 transition"
              >
                <span>System-Wide Audit Ledger</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
