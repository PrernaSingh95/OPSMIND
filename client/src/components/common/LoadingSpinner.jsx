import React from 'react';

export const LoadingSpinner = ({ text = "Processing with OpsMind Agents..." }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <div className="relative w-12 h-12">
      <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
      </div>
    </div>
    {text && <p className="mt-4 text-sm text-gray-400 font-medium tracking-wide">{text}</p>}
  </div>
);

export default LoadingSpinner;
