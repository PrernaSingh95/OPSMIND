import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  Bot, 
  BookOpen, 
  Search, 
  Scale, 
  ShieldAlert, 
  Zap, 
  Mail, 
  Inbox
} from 'lucide-react';

const steps = [
  { id: 'Intake', label: '1. Intake', icon: Inbox, desc: 'Case Ingestion & Triage' },
  { id: 'Understanding', label: '2. Understanding', icon: Bot, desc: 'Intent & Entity Extraction' },
  { id: 'KnowledgeRetrieval', label: '3. RAG Policy', icon: BookOpen, desc: 'SOP & Policy Grounding' },
  { id: 'Investigation', label: '4. Investigation', icon: Search, desc: 'OMS & PG Tool Ledger' },
  { id: 'Decision', label: '5. Decision', icon: Scale, desc: 'Reasoning Synthesis' },
  { id: 'RiskCheck', label: '6. Risk Check', icon: ShieldAlert, desc: 'Financial & Risk Scoring' },
  { id: 'HumanApproval', label: '7. Action / Approval', icon: Zap, desc: 'Auto-Remedy or HITL Review' },
  { id: 'Communication', label: '8. Communication', icon: Mail, desc: 'Grounded Customer Messaging' },
];

export const WorkflowStepper = ({ 
  workflowState = {}, 
  activeTab = 'Understanding', 
  onSelectTab,
  riskCheckResult = {} 
}) => {
  const completedSteps = workflowState.completedSteps || [];
  const currentStep = workflowState.currentStep || 'Intake';
  const requiresApproval = riskCheckResult.requiresApproval;

  return (
    <div className="glass-panel p-4 rounded-xl border border-gray-800">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">Autonomous Agent Pipeline</span>
        </div>
        <div className="text-[11px] text-gray-400">
          Status: <span className="text-emerald-400 font-semibold">{currentStep}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isSelected = activeTab === step.id;
          const isApprovalStep = step.id === 'HumanApproval';

          let stateClass = 'border-gray-800 bg-gray-900/40 text-gray-400';
          let iconClass = 'text-gray-400';

          if (isCompleted) {
            stateClass = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300';
            iconClass = 'text-emerald-400';
          } else if (isCurrent) {
            if (isApprovalStep && requiresApproval) {
              stateClass = 'border-amber-500/60 bg-amber-500/15 text-amber-300 animate-pulse';
              iconClass = 'text-amber-400';
            } else {
              stateClass = 'border-emerald-500/60 bg-emerald-500/20 text-emerald-300 animate-pulse';
              iconClass = 'text-emerald-400';
            }
          }

          if (isSelected) {
            stateClass += ' ring-2 ring-emerald-500/50 shadow-md';
          }

          return (
            <button
              key={step.id}
              onClick={() => onSelectTab && onSelectTab(step.id)}
              className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all ${stateClass} hover:border-gray-700`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <Icon className={`w-4 h-4 ${iconClass}`} />
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  isApprovalStep && requiresApproval ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                  )
                ) : (
                  <Circle className="w-3.5 h-3.5 text-gray-400 opacity-40" />
                )}
              </div>
              <span className="text-[11px] font-bold leading-tight line-clamp-1">{step.label}</span>
              <span className="text-[9px] text-gray-400 line-clamp-1 mt-0.5">{step.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowStepper;
