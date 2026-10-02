const KnowledgeDocument = require('../models/KnowledgeDocument');
const { searchKnowledgeBase } = require('../services/ragService');

exports.getDocuments = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;

    const docs = await KnowledgeDocument.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: docs.length, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchDocuments = async (req, res) => {
  try {
    const { query, category, limit } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query string is required' });
    }

    const results = await searchKnowledgeBase(query, { category, limit: limit || 4 });
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createDocument = async (req, res) => {
  try {
    const { title, category, content, tags } = req.body;
    const doc = await KnowledgeDocument.create({
      title,
      category,
      content,
      tags: Array.isArray(tags) ? tags : (tags || '').split(',').map(t => t.trim()).filter(Boolean)
    });
    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    await KnowledgeDocument.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Document deleted from RAG store' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
