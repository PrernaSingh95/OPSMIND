const { retrieveKnowledge } = require('../ragService');

/**
 * RAG Knowledge Agent
 * Responsibilities:
 * - Query active organizational SOPs and policies
 * - Identify matching clauses and conditions
 * - Provide transparent policy citations and excerpts for grounding
 */
const runRagKnowledgeAgent = async (caseData, understandingResult) => {
  const searchQuery = `${caseData.title} ${caseData.description} ${understandingResult?.intent || ''}`;
  const category = understandingResult?.suggestedCategory || caseData.category;

  const ragOutput = await retrieveKnowledge({
    query: searchQuery,
    category,
    limit: 3
  });

  return {
    retrievedDocuments: ragOutput.retrievedDocuments,
    appliedPolicy: ragOutput.appliedPolicy,
    policyReference: ragOutput.policyReference,
    executedAt: new Date()
  };
};

module.exports = {
  runRAGKnowledgeAgent: runRagKnowledgeAgent,
  runRagKnowledgeAgent
};

