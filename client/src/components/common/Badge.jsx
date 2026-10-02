import React from 'react';

export const StatusBadge = ({ status }) => {
  const map = {
    'New': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    'Processing': 'bg-purple-500/15 text-purple-400 border-purple-500/30 animate-pulse-slow',
    'Awaiting Approval': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    'Resolved': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'Escalated': 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    'Closed': 'bg-gray-500/15 text-gray-400 border-gray-500/30'
  };

  const style = map[status] || 'bg-gray-500/15 text-gray-300 border-gray-500/30';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const map = {
    'Low': 'bg-gray-500/15 text-gray-300 border-gray-600/40',
    'Medium': 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    'High': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    'Critical': 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
  };

  const style = map[priority] || 'bg-gray-500/15 text-gray-300 border-gray-600/40';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${style}`}>
      {priority}
    </span>
  );
};

export const RiskBadge = ({ riskLevel, score }) => {
  const map = {
    'Low': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'Medium': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    'High': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    'Critical': 'bg-rose-500/20 text-rose-400 border-rose-500/40'
  };

  const style = map[riskLevel] || 'bg-gray-500/15 text-gray-300 border-gray-600/40';

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${style}`}>
      <span>Risk: {riskLevel}</span>
      {score !== undefined && <span className="opacity-75 font-mono">({score}/100)</span>}
    </span>
  );
};

export default { StatusBadge, PriorityBadge, RiskBadge };
