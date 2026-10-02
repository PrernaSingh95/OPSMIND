import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderKanban, 
  Search, 
  Filter, 
  Sparkles, 
  RefreshCw, 
  ArrowUpRight,
  Bot
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { casesAPI } from '../services/api';

export const Cases = ({ onOpenIntake }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await casesAPI.getAll({
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        search: searchQuery
      });
      setCases(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load cases', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [statusFilter, priorityFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCases();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-gray-800">
        <div>
          <div className="flex items-center gap-3">
            <FolderKanban className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
              Case & Ticket Operations
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Manage, triage, and inspect autonomous multi-agent pipelines for customer operations cases.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCases}
            className="p-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={onOpenIntake}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg shadow-md hover:shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Case Intake</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by case #, title, customer, order ID..."
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </form>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="Processing">Processing</option>
            <option value="Awaiting Approval">Awaiting Approval</option>
            <option value="Resolved">Resolved</option>
            <option value="Escalated">Escalated</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Cancellation & Refund">Cancellation & Refund</option>
            <option value="Billing & Payments">Billing & Payments</option>
            <option value="Order Management">Order Management</option>
            <option value="Account & Access">Account & Access</option>
          </select>
        </div>
      </div>

      {/* Cases Table */}
      {loading ? (
        <LoadingSpinner text="Loading cases..." />
      ) : cases.length === 0 ? (
        <EmptyState
          title="No Cases Found"
          description="No operations cases match your active search or filter criteria."
          actionText="Create Sample Case"
          onAction={onOpenIntake}
          icon={FolderKanban}
        />
      ) : (
        <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/90 text-gray-400 uppercase font-semibold border-b border-gray-800">
                <tr>
                  <th className="px-5 py-3.5">Case #</th>
                  <th className="px-5 py-3.5">Title & Customer</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Workflow Step</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-200">
                {cases.map((c) => (
                  <tr
                    key={c._id}
                    onClick={() => navigate(`/cases/${c._id}`)}
                    className="hover:bg-gray-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-4 font-mono font-bold text-emerald-400 group-hover:text-emerald-300">
                      {c.caseNumber}
                    </td>
                    <td className="px-5 py-4 space-y-0.5">
                      <div className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {c.title}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {c.customer?.name} ({c.customer?.email})
                        {c.orderId && <span className="ml-2 font-mono text-gray-500">Order: {c.orderId}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-300">
                      {c.category}
                    </td>
                    <td className="px-5 py-4">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="px-5 py-4 font-mono text-emerald-400 text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-emerald-400" />
                        {c.workflowState?.currentStep}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="p-1.5 rounded-lg bg-gray-800 text-gray-300 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cases;
