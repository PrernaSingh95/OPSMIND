import React from 'react';
import { Sparkles, Info } from 'lucide-react';

export const SimulatedDataBadge = ({ text = "Simulated Demo Data", size = "sm" }) => {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 ${
      size === 'xs' ? 'text-[11px]' : 'text-xs'
    }`}>
      <Sparkles className="w-3 h-3 text-amber-400" />
      {text}
    </span>
  );
};

export default SimulatedDataBadge;
