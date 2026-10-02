const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const caseRoutes = require('./routes/caseRoutes');
const knowledgeRoutes = require('./routes/knowledgeRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const promptRoutes = require('./routes/promptRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const auditRoutes = require('./routes/auditRoutes');
const toolRoutes = require('./routes/toolRoutes');

const app = express();

// Security & Parsing Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ONLINE',
    platform: 'OpsMind AI - Autonomous Operations Intelligence Platform',
    version: '1.0.0',
    aiMode: process.env.AI_MODE || 'mock',
    timestamp: new Date()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/communications', communicationRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/tools', toolRoutes);

// 404 Catch-All
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found on OpsMind AI Server.`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
