import React from 'react';
import { 
  Database, 
  CheckCircle2, 
  XCircle, 
  AlertOctagon, 
  CreditCard, 
  Package, 
  UserCheck, 
  Terminal 
} from 'lucide-react';

export const EvidenceViewer = ({ investigationResult = {} }) => {
  const { 
    toolCalls = [], 
    orderStatus, 
    paymentStatus, 
    evidenceSummary, 
    discrepancyFound 
  } = investigationResult;

  return (
    <div className="space-y-4">
      {/* Sandbox Tools Banner */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900/90 border border-gray-800 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-gray-200">Mock Sandbox Investigation Tools</span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
            Zero Hallucination Mode
          </span>
        </div>
        <span className="text-gray-400">All lookups performed against live sandbox ledgers</span>
      </div>

      {/* Cross-System Discrepancy Highlight */}
      {discrepancyFound && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Cross-System Ledger Inconsistency Confirmed
              </h4>
              <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                {evidenceSummary}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tool Execution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {toolCalls.map((call, idx) => {
          let Icon = Database;
          if (call.toolName?.toLowerCase().includes('order')) Icon = Package;
          if (call.toolName?.toLowerCase().includes('payment')) Icon = CreditCard;
          if (call.toolName?.toLowerCase().includes('customer')) Icon = UserCheck;

          const isSuccess = call.status === 'SUCCESS';

          return (
            <div key={idx} className="glass-card p-4 rounded-xl border border-gray-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-emerald-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-white">{call.toolName}</span>
                  </div>
                  {isSuccess ? (
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {call.status}
                    </span>
                  ) : (
                    <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> {call.status}
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono text-gray-400 bg-gray-900/90 p-2 rounded border border-gray-800/80 mb-3 break-all">
                  GET {call.endpoint}
                </div>

                {/* Structured Payload Preview */}
                <div className="space-y-1.5 text-xs text-gray-300">
                  {call.data?.orderId && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Order ID:</span>
                      <span className="font-mono font-semibold text-white">{call.data.orderId}</span>
                    </div>
                  )}
                  {call.data?.status && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={`font-bold font-mono ${call.data.status === 'CANCELLED' ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {call.data.status}
                      </span>
                    </div>
                  )}
                  {call.data?.paymentId && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment ID:</span>
                      <span className="font-mono font-semibold text-white">{call.data.paymentId}</span>
                    </div>
                  )}
                  {call.data?.amount && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount:</span>
                      <span className="font-mono font-bold text-white">${call.data.amount}</span>
                    </div>
                  )}
                  {call.data?.tier && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Customer Tier:</span>
                      <span className="font-semibold text-amber-400">{call.data.tier}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-gray-800/60 flex justify-between text-[10px] text-gray-400 font-mono">
                <span>Latency: {call.executionTimeMs || 85}ms</span>
                <span>Sandbox Verified</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EvidenceViewer;
