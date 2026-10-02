import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Sparkles, Send, Bot, AlertCircle } from 'lucide-react';
import { casesAPI } from '../../services/api';

export const CaseIntakeModal = ({ isOpen, onClose, onCaseCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Cancellation & Refund',
    priority: 'High',
    customerName: '',
    customerEmail: '',
    orderId: '',
    paymentId: '',
    autoTriggerWorkflow: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDemoScenario = () => {
    setFormData({
      title: 'Payment was deducted but my order was cancelled',
      description: 'I placed an order for Wireless Headphones (ORDER-1001). My payment of $129.99 (PAY-1001) was successfully deducted from my card, but my order shows CANCELLED in the portal. Please refund my money immediately.',
      category: 'Cancellation & Refund',
      priority: 'High',
      customerName: 'Alex Morgan',
      customerEmail: 'alex.morgan@example.com',
      orderId: 'ORDER-1001',
      paymentId: 'PAY-1001',
      autoTriggerWorkflow: true
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError('Please provide a Case Title and Description');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        customer: {
          name: formData.customerName || 'Alex Morgan',
          email: formData.customerEmail || 'customer@example.com',
          customerId: 'CUST-1001'
        },
        orderId: formData.orderId,
        paymentId: formData.paymentId,
        autoTriggerWorkflow: formData.autoTriggerWorkflow
      };

      const res = await casesAPI.create(payload);
      setLoading(false);
      onClose();
      if (onCaseCreated) {
        onCaseCreated(res.data.data);
      }
    } catch (err) {
      console.error('Case intake error:', err);
      setError(err.response?.data?.message || 'Failed to submit case');
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Operations Case Intake">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick Demo Scenario Button */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 via-gray-900 to-teal-950/40 border border-emerald-500/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300">
              Demo Scenario Quick-Fill
            </span>
          </div>
          <button
            type="button"
            onClick={loadDemoScenario}
            className="px-3 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            Load Primary PPT Scenario
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Customer Name</label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="e.g. Alex Morgan"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Customer Email</label>
            <input
              type="email"
              required
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              placeholder="alex.morgan@example.com"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Case Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Payment was deducted but my order was cancelled"
            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Detailed Case Description</label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the operational issue, error message, or customer problem..."
            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option>Cancellation & Refund</option>
              <option>Billing & Payments</option>
              <option>Order Management</option>
              <option>Account & Access</option>
              <option>Technical Issue</option>
              <option>General Inquiry</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Order ID</label>
            <input
              type="text"
              value={formData.orderId}
              onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
              placeholder="e.g. ORDER-1001"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Payment ID</label>
            <input
              type="text"
              value={formData.paymentId}
              onChange={(e) => setFormData({ ...formData, paymentId: e.target.value })}
              placeholder="e.g. PAY-1001"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Auto-Trigger Pipeline Option */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-900/60 border border-gray-800">
          <input
            type="checkbox"
            id="autoTrigger"
            checked={formData.autoTriggerWorkflow}
            onChange={(e) => setFormData({ ...formData, autoTriggerWorkflow: e.target.checked })}
            className="rounded bg-gray-800 border-gray-700 text-emerald-500 focus:ring-0 w-4 h-4 cursor-pointer"
          />
          <label htmlFor="autoTrigger" className="text-xs text-gray-300 cursor-pointer flex items-center gap-1.5 font-medium">
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>Immediately execute autonomous 8-stage agent orchestration pipeline</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            {loading ? (
              <span>Orchestrating Agents...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit & Ingest Case</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CaseIntakeModal;
