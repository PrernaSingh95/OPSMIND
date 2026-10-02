import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Trash2, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Tag, 
  Layers,
  ArrowRight,
  Database,
  RefreshCw
} from 'lucide-react';
import { knowledgeAPI } from '../services/api';
import Modal from '../components/common/Modal';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

export default function KnowledgeBase() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Interactive RAG Retrieval Playground State
  const [ragQuery, setRagQuery] = useState('Payment was deducted but my order was cancelled');
  const [ragCategory, setRagCategory] = useState('All');
  const [ragResults, setRagResults] = useState(null);
  const [searchingRag, setSearchingRag] = useState(false);

  // Add Document Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'Billing & Payments',
    content: '',
    tags: 'refund, payment, order'
  });
  const [savingDoc, setSavingDoc] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await knowledgeAPI.getAll({ category: categoryFilter !== 'All' ? categoryFilter : undefined });
      if (res.data.success) {
        setDocs(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching knowledge base:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [categoryFilter]);

  const handleTestRag = async (e) => {
    if (e) e.preventDefault();
    if (!ragQuery.trim()) return;

    try {
      setSearchingRag(true);
      const res = await knowledgeAPI.search(
        ragQuery, 
        ragCategory !== 'All' ? ragCategory : undefined
      );
      if (res.data.success) {
        setRagResults(res.data.data);
      }
    } catch (err) {
      console.error('RAG test error:', err);
    } finally {
      setSearchingRag(false);
    }
  };

  const handleCreateDoc = async (e) => {
    e.preventDefault();
    try {
      setSavingDoc(true);
      const tagsArray = newDoc.tags.split(',').map(t => t.trim()).filter(Boolean);
      const res = await knowledgeAPI.create({
        ...newDoc,
        tags: tagsArray
      });
      if (res.data.success) {
        setIsAddModalOpen(false);
        setNewDoc({ title: '', category: 'Billing & Payments', content: '', tags: 'refund, payment' });
        fetchDocuments();
      }
    } catch (err) {
      console.error('Create doc error:', err);
    } finally {
      setSavingDoc(false);
    }
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm('Delete this knowledge document from the RAG store?')) return;
    try {
      await knowledgeAPI.delete(id);
      fetchDocuments();
    } catch (err) {
      console.error('Delete doc error:', err);
    }
  };

  const filteredDocs = docs.filter(doc => 
    doc.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">RAG Knowledge Base & SOPs</h1>
            <SimulatedDataBadge />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Enterprise ground-truth repository powering RAG retrieval for all autonomous decision-making agents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-950/40 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Policy Document</span>
          </button>
        </div>
      </div>

      {/* RAG Retrieval Simulator / Interactive Playground */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Live RAG Semantic Retrieval Playground
              </h2>
              <p className="text-xs text-gray-400">
                Simulate how the RAG Knowledge Agent searches and retrieves relevant SOP chunks for a given case.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <Database className="w-3.5 h-3.5" />
            <span>Hybrid Keyword + Semantic Vector Engine</span>
          </div>
        </div>

        <form onSubmit={handleTestRag} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={ragQuery}
              onChange={(e) => setRagQuery(e.target.value)}
              placeholder="Enter customer inquiry or scenario to test RAG retrieval..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <select
            value={ragCategory}
            onChange={(e) => setRagCategory(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Categories</option>
            <option value="Billing & Payments">Billing & Payments</option>
            <option value="Orders & Logistics">Orders & Logistics</option>
            <option value="Compliance & Escalations">Compliance & Escalations</option>
            <option value="Customer Support">Customer Support</option>
          </select>
          <button
            type="submit"
            disabled={searchingRag}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
          >
            {searchingRag ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Test Retrieval</span>
          </button>
        </form>

        {/* Live RAG Output */}
        {ragResults && (
          <div className="mt-5 pt-4 border-t border-gray-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-300">
                Retrieved {ragResults.length} Grounding Chunks for: "{ragQuery}"
              </span>
              <span className="text-emerald-400 font-mono">Similarity Threshold: &gt; 0.65</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ragResults.map((result, idx) => (
                <div key={idx} className="p-4 bg-gray-900/90 rounded-xl border border-gray-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      {result.title || result.documentTitle}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono text-[10px] font-bold">
                      Match: {Math.round((result.score || result.similarity || 0.88) * 100)}%
                    </span>
                  </div>
                  <p className="text-gray-300 leading-relaxed bg-black/30 p-2.5 rounded-lg border border-gray-800/50 font-mono text-[11px]">
                    "{result.content || result.snippet}"
                  </p>
                  <div className="text-[10px] text-gray-400 flex items-center gap-2">
                    <Tag className="w-3 h-3 text-gray-400" />
                    <span>Category: {result.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter Bar & Document Library */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {['All', 'Billing & Payments', 'Orders & Logistics', 'Compliance & Escalations', 'Customer Support'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  categoryFilter === cat
                    ? 'bg-gray-800 text-white border border-gray-700 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter policy documents..."
              className="w-full pl-9 pr-4 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <LoadingSpinner text="Indexing knowledge repository..." />
        ) : filteredDocs.length === 0 ? (
          <EmptyState
            title="No Knowledge Documents Found"
            description="Create your first SOP or policy document to ground autonomous agents."
            actionText="Add Policy Document"
            onAction={() => setIsAddModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => (
              <div 
                key={doc._id}
                className="glass-panel p-5 rounded-xl border border-gray-800 hover:border-gray-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-gray-800 text-emerald-400 font-semibold border border-gray-700/50">
                      {doc.category}
                    </span>
                    <button
                      onClick={() => handleDeleteDoc(doc._id)}
                      className="text-gray-400 hover:text-rose-400 transition"
                      title="Delete Policy"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 line-clamp-1">{doc.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-4 leading-relaxed mb-4">
                    {doc.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400">
                  <div className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-gray-400" />
                    <span>v{doc.version || 1}.0</span>
                  </div>
                  <span>{new Date(doc.updatedAt || doc.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Document Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Enterprise Policy / SOP Document"
        size="lg"
      >
        <form onSubmit={handleCreateDoc} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Document Title</label>
            <input
              type="text"
              required
              value={newDoc.title}
              onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              placeholder="e.g., Payment Failure & Auto-Refund SOP"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
            <select
              value={newDoc.category}
              onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Billing & Payments">Billing & Payments</option>
              <option value="Orders & Logistics">Orders & Logistics</option>
              <option value="Compliance & Escalations">Compliance & Escalations</option>
              <option value="Customer Support">Customer Support</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Policy Content & SOP Rules</label>
            <textarea
              required
              rows={6}
              value={newDoc.content}
              onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
              placeholder="Specify ground truth rules, auto-refund thresholds, verification steps, and escalation triggers..."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={newDoc.tags}
              onChange={(e) => setNewDoc({ ...newDoc, tags: e.target.value })}
              placeholder="refund, payment, failure, gateway"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingDoc}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold"
            >
              {savingDoc ? 'Indexing...' : 'Save & Index in RAG'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
