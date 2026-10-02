import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  AlertTriangle,
  FileText,
  User,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { approvalsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/Badge';
import Modal from '../components/common/Modal';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

export default function Approvals() {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Review Modal State
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState('Approved'); // Approved | Rejected
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [decisionError, setDecisionError] = useState(null);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await approvalsAPI.getAll({ status: statusFilter !== 'All' ? statusFilter : undefined });
      if (res.data.success) {
        setApprovals(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [statusFilter]);

  const handleOpenDecision = (approval, type) => {
    setSelectedApproval(approval);
    setDecisionType(type);
    setDecisionError(null);
    setReviewerNotes(type === 'Approved' ? 'Reviewed evidence ledger and confirmed refund according to high-value threshold policy.' : 'Rejected due to missing customer proof.');
    setDecisionModalOpen(true);
  };

  const handleExecuteDecision = async (e) => {
    e.preventDefault();
    if (!selectedApproval) return;
    setDecisionError(null);
    try {
      setSubmitting(true);
      const res = await approvalsAPI.decide(selectedApproval._id, decisionType, reviewerNotes);
      if (res.data.success) {
        setActionSuccess(`Approval record successfully ${decisionType.toLowerCase()}.`);
        setDecisionModalOpen(false);
        setSelectedApproval(null);
        fetchApprovals();
      }
    } catch (err) {
      console.error('Error deciding approval:', err);
      const msg = err.response?.data?.message || 'Request failed. Check your role permissions.';
      setDecisionError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredApprovals = approvals.filter(item => {
    const caseNum = item.caseId?.caseNumber || '';
    const caseTitle = item.caseId?.title || '';
    const action = item.proposedAction || '';
    const q = searchQuery.toLowerCase();
    return caseNum.toLowerCase().includes(q) || caseTitle.toLowerCase().includes(q) || action.toLowerCase().includes(q);
  });

  const canApprove = ['Admin', 'Manager'].includes(user?.role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">Human Approval Center (HITL)</h1>
            <SimulatedDataBadge />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Governance gateway for cases exceeding autonomous risk and financial disbursement thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchApprovals}
            className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition"
            title="Refresh Approvals"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess(null)} className="font-bold underline">Dismiss</button>
        </div>
      )}

      {/* Role Alert */}
      {!canApprove && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>You are logged in as <strong>{user?.role}</strong> (Read-Only access). Manager or Admin privileges are required to authorize or reject financial actions.</span>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['Pending', 'Approved', 'Rejected', 'All'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${statusFilter === st
                  ? 'bg-gray-800 text-white border border-gray-700 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search approvals by case or action..."
            className="w-full pl-9 pr-4 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Approvals List */}
      {loading ? (
        <LoadingSpinner text="Loading Human Approval Queue..." />
      ) : filteredApprovals.length === 0 ? (
        <EmptyState
          title="No Approvals in This Queue"
          description={statusFilter === 'Pending' ? "All autonomous risk thresholds are clear. No human-in-the-loop interventions currently required." : "No records match the selected filter."}
        />
      ) : (
        <div className="space-y-4">
          {filteredApprovals.map((approval) => {
            const caseItem = approval.caseId || {};
            const isPending = approval.status === 'PENDING';

            return (
              <div
                key={approval._id}
                className={`glass-panel p-5 rounded-2xl border transition ${isPending
                    ? 'border-amber-500/40 bg-amber-950/10 hover:border-amber-500/60'
                    : 'border-gray-800 hover:border-gray-700'
                  }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Case Info & Action Proposal */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-mono text-emerald-400 font-bold">{caseItem.caseNumber || 'CASE-UNK'}</span>
                      <StatusBadge status={approval.status} />
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${approval.riskLevel === 'High' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          approval.riskLevel === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                        Risk: {approval.riskLevel || 'Medium'}
                      </span>
                      <span className="text-xs text-gray-400">
                        Requested: {new Date(approval.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">
                      {caseItem.title || 'Case Review Required'}
                    </h3>

                    {/* Reasoning Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                      <div className="p-3 bg-gray-900/80 rounded-lg border border-gray-800">
                        <span className="text-gray-400 text-[10px] uppercase font-bold block mb-1">Proposed Autonomous Action</span>
                        <span className="text-emerald-300 font-semibold">{approval.proposedAction || 'Process Full Refund'}</span>
                      </div>

                      <div className="p-3 bg-gray-900/80 rounded-lg border border-gray-800">
                        <span className="text-gray-400 text-[10px] uppercase font-bold block mb-1">Decision Rationale</span>
                        <span className="text-gray-300 line-clamp-2">{approval.decisionRationale || 'Payment confirmed charged on gateway while order status is marked Cancelled.'}</span>
                      </div>
                    </div>

                    {approval.riskFactors && approval.riskFactors.length > 0 && (
                      <div className="text-[11px] text-amber-300/90 flex items-center gap-1.5 pt-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span><strong>Trigger Risk Factors:</strong> {approval.riskFactors.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-center gap-2 shrink-0">
                    <Link
                      to={`/cases/${caseItem._id || approval.caseId}`}
                      className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white rounded-xl text-xs font-semibold border border-gray-700 flex items-center gap-1.5 transition w-full sm:w-auto justify-center"
                    >
                      <span>Inspect Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    {isPending && canApprove && (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleOpenDecision(approval, 'Approved')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-950/30 flex-1 sm:flex-initial justify-center"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleOpenDecision(approval, 'Rejected')}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-rose-950/30 flex-1 sm:flex-initial justify-center"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Approval Decision Modal */}
      <Modal
        isOpen={decisionModalOpen}
        onClose={() => setDecisionModalOpen(false)}
        title={decisionType === 'Approved' ? 'Authorize High-Risk Action' : 'Reject Action Proposal'}
        size="md"
      >
        <form onSubmit={handleExecuteDecision} className="space-y-4">
          <div className="p-3.5 rounded-lg bg-gray-900 border border-gray-800 text-xs space-y-1.5">
            <div className="text-gray-400">Target Case: <span className="text-white font-mono">{selectedApproval?.caseId?.caseNumber}</span></div>
            <div className="text-gray-400">Action: <span className="text-emerald-300 font-bold">{selectedApproval?.proposedAction}</span></div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Manager / Reviewer Notes</label>
            <textarea
              required
              rows={4}
              value={reviewerNotes}
              onChange={(e) => setReviewerNotes(e.target.value)}
              placeholder="Enter justification for audit log..."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {decisionError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              ⚠️ {decisionError}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDecisionModalOpen(false)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 text-white rounded-lg text-xs font-bold transition ${decisionType === 'Approved' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                }`}
            >
              {submitting ? 'Executing...' : `Confirm ${decisionType}`}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
