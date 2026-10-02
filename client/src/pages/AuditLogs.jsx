import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  Code2, 
  ShieldCheck, 
  Clock, 
  RefreshCw, 
  Bot, 
  User, 
  Terminal,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { auditAPI } from '../services/api';
import Modal from '../components/common/Modal';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [agentFilter, setAgentFilter] = useState('All');
  
  // JSON Inspector Modal
  const [selectedLog, setSelectedLog] = useState(null);
  const [jsonModalOpen, setJsonModalOpen] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await auditAPI.getAll({ agent: agentFilter !== 'All' ? agentFilter : undefined });
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch (err) {
      console.error('Audit logs fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [agentFilter]);

  const handleOpenJson = (log) => {
    setSelectedLog(log);
    setJsonModalOpen(true);
  };

  const filteredLogs = logs.filter(log => {
    const caseNum = log.caseId?.caseNumber || '';
    const action = log.actionDescription || log.action || '';
    const details = typeof log.details === 'string' ? log.details : JSON.stringify(log.details || '');
    const actor = log.actor?.name || log.agentName || log.agent || '';
    const q = searchQuery.toLowerCase();
    return caseNum.toLowerCase().includes(q) || action.toLowerCase().includes(q) || details.toLowerCase().includes(q) || actor.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">Immutable Enterprise Audit Trail</h1>
            <SimulatedDataBadge />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Complete cryptographic telemetry logging every autonomous agent decision, tool call, and human approval.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition"
            title="Refresh Audit Logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'UnderstandingAgent', 'RAGKnowledgeAgent', 'InvestigationAgent', 'DecisionAgent', 'RiskCheckAgent', 'HumanReviewer'].map(agent => (
            <button
              key={agent}
              onClick={() => setAgentFilter(agent)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                agentFilter === agent
                  ? 'bg-gray-800 text-white border border-gray-700 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {agent === 'All' ? 'All Actors' : agent.replace('Agent', '')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail..."
            className="w-full pl-9 pr-4 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Audit Logs Table */}
      {loading ? (
        <LoadingSpinner text="Querying distributed audit ledger..." />
      ) : filteredLogs.length === 0 ? (
        <EmptyState
          title="No Audit Records Found"
          description="Every case execution and human interaction automatically registers here."
        />
      ) : (
        <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/90 text-gray-400 text-[10px] uppercase font-bold border-b border-gray-800">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Target Case</th>
                  <th className="p-3.5">Actor / Agent</th>
                  <th className="p-3.5">Action Executed</th>
                  <th className="p-3.5">Details & Telemetry</th>
                  <th className="p-3.5 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-mono text-[11px]">
                {filteredLogs.map((log) => {
                  const isAgent = log.agentName?.includes('Agent') || log.actor?.role === 'AI Agent';
                  const caseNum = log.caseId?.caseNumber || log.caseNumber || 'GLOBAL';

                  return (
                    <tr key={log._id} className="hover:bg-gray-900/40 transition">
                      <td className="p-3.5 text-gray-400 whitespace-nowrap">
                        {new Date(log.timestamp || log.createdAt).toLocaleTimeString()}
                      </td>

                      <td className="p-3.5">
                        <span className="text-emerald-400 font-bold">{caseNum}</span>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 font-sans font-medium">
                          {isAgent ? (
                            <Bot className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          )}
                          <span className="text-white">{log.actor?.name || log.agentName || log.agent || 'System'}</span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-gray-900 border border-gray-700/60 text-gray-200">
                          {log.actionDescription || log.action || log.eventType}
                        </span>
                      </td>

                      <td className="p-3.5 font-sans text-gray-300 max-w-xs truncate">
                        {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleOpenJson(log)}
                          className="px-2.5 py-1 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-emerald-400 rounded-lg border border-gray-800 text-[10px] font-mono transition"
                        >
                          Payload JSON
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Raw JSON Inspector Modal */}
      <Modal
        isOpen={jsonModalOpen}
        onClose={() => setJsonModalOpen(false)}
        title="Audit Log Structured Telemetry Payload"
        size="lg"
      >
        {selectedLog && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-400 border-b border-gray-800 pb-2">
              <span>Event ID: <strong className="text-emerald-400 font-mono">{selectedLog._id}</strong></span>
              <span>{new Date(selectedLog.timestamp || selectedLog.createdAt).toISOString()}</span>
            </div>
            <pre className="p-4 bg-black/80 rounded-xl border border-gray-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-96">
              {JSON.stringify(selectedLog, null, 2)}
            </pre>
          </div>
        )}
      </Modal>
    </div>
  );
}
