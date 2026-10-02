import React from 'react';

export const EmptyState = ({ title, description, actionText, onAction, icon: Icon }) => (
  <div className="glass-panel rounded-xl border border-gray-800 p-12 text-center flex flex-col items-center justify-center">
    {Icon && (
      <div className="p-4 rounded-2xl bg-gray-800/60 border border-gray-700 text-gray-400 mb-4">
        <Icon className="w-8 h-8" />
      </div>
    )}
    <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
    <p className="text-sm text-gray-400 max-w-sm mb-6">{description}</p>
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg transition-colors shadow-md"
      >
        {actionText}
      </button>
    )}
  </div>
);

export default EmptyState;
