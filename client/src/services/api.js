import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach token on every outgoing request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('opsmind_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Cases
export const casesAPI = {
  getAll: (params) => api.get('/cases', { params }),
  getById: (id) => api.get(`/cases/${id}`),
  create: (data) => api.post('/cases', data),
  processWorkflow: (id) => api.post(`/cases/${id}/process`),
  delete: (id) => api.delete(`/cases/${id}`)
};

// Knowledge Base (RAG)
export const knowledgeAPI = {
  getAll: (params) => api.get('/knowledge', { params }),
  search: (query, category) => api.post('/knowledge/search', { query, category }),
  create: (data) => api.post('/knowledge', data),
  delete: (id) => api.delete(`/knowledge/${id}`)
};

// Approvals (Human-in-the-loop)
export const approvalsAPI = {
  getAll: (params) => api.get('/approvals', { params }),
  decide: (id, decision, reviewerNotes) => api.post(`/approvals/${id}/decide`, { decision, reviewerNotes })
};

// Prompts Engineering
export const promptsAPI = {
  getAll: (params) => api.get('/prompts', { params }),
  create: (data) => api.post('/prompts', data),
  compare: (promptV1Id, promptV2Id, testInput) => api.post('/prompts/compare', { promptV1Id, promptV2Id, testInput })
};

// Evaluations Benchmarks
export const evaluationsAPI = {
  getLatest: () => api.get('/evaluations/latest'),
  run: () => api.post('/evaluations/run')
};

// Analytics
export const analyticsAPI = {
  getAnalytics: () => api.get('/analytics')
};

// Audit Logs
export const auditAPI = {
  getAll: (params) => api.get('/audit', { params })
};

// Mock Sandbox Tools
export const toolsAPI = {
  getOrder: (orderId) => api.get(`/tools/orders/${orderId}`),
  getPayment: (paymentId) => api.get(`/tools/payments/${paymentId}`),
  getCustomer: (customerId) => api.get(`/tools/customers/${customerId}`),
  getSandboxStatus: () => api.get('/tools/sandbox-status')
};

// Communications
export const communicationsAPI = {
  getAll: (params) => api.get('/communications', { params }),
  sendSimulated: (id) => api.post(`/communications/${id}/send`)
};

export default api;
