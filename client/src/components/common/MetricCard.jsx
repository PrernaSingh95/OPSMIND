import React from 'react';
import SimulatedDataBadge from './SimulatedDataBadge';

export const MetricCard = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  color = 'emerald',
  isSimulated = true
}) => {
  const colorMap = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    teal: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
  };

  const badgeClass = colorMap[color] || colorMap.emerald;

  return (
    <div className="glass-panel p-5 rounded-xl border border-gray-800 hover:border-gray-700 transition-all shadow-lg relative group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</span>
            {isSimulated && <SimulatedDataBadge size="xs" text="Demo Data" />}
          </div>
          <div className="text-2xl lg:text-3xl font-bold tracking-tight text-white mt-1">
            {value}
          </div>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg border ${badgeClass}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || change) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {change && (
            <span className={`font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? '↑' : '↓'} {change}
            </span>
          )}
          {subtitle && <span className="text-gray-400">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
