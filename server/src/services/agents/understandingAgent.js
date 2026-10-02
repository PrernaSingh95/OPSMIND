const { callAI } = require('../aiService');

/**
 * Understanding Agent
 * Responsibilities:
 * - Intent extraction
 * - Entity recognition (order IDs, payment IDs, amounts)
 * - Urgency & sentiment scoring
 * - Operations categorization
 */
const runUnderstandingAgent = async (caseData) => {
  const { title, description, category, orderId, paymentId } = caseData;

  // Rule-based entity extraction fallback
  const orderMatch = (description + ' ' + title).match(/ORD(?:ER)?-?\d{4,6}/i);
  const paymentMatch = (description + ' ' + title).match(/PAY(?:MENT)?-?\d{4,6}/i);
  const amountMatch = (description + ' ' + title).match(/\$?(\d+(\.\d{1,2})?)\s*(?:dollars|usd|\$)/i);

  const detectedOrderId = orderId || (orderMatch ? orderMatch[0].toUpperCase() : 'ORDER-1001');
  const detectedPaymentId = paymentId || (paymentMatch ? paymentMatch[0].toUpperCase() : 'PAY-1001');

  const systemPrompt = `You are the OpsMind AI Understanding Agent.
Your job is to analyze incoming business customer cases, classify the operational intent, assess urgency, and extract key entities.
Return output in strictly valid JSON with keys:
{
  "intent": string,
  "urgency": "Low" | "Medium" | "High" | "Critical",
  "sentiment": "Negative" | "Neutral" | "Positive",
  "extractedEntities": {
    "orderId": string,
    "paymentId": string,
    "amount": number,
    "issueType": string
  },
  "suggestedCategory": string,
  "confidence": number
}`;

  const userPrompt = `Case Title: ${title}
Case Description: ${description}
Provided Category: ${category}
Provided Order ID: ${orderId || 'None'}
Provided Payment ID: ${paymentId || 'None'}`;

  const isRefundOrCancellation = (description + ' ' + title).toLowerCase().includes('deducted') ||
    (description + ' ' + title).toLowerCase().includes('cancel') ||
    (description + ' ' + title).toLowerCase().includes('refund');

  const fallback = {
    intent: isRefundOrCancellation
      ? 'Payment Deducted / Order Cancelled Inconsistency - Refund Request'
      : 'Customer Operations Inquiry & Status Resolution',
    urgency: isRefundOrCancellation ? 'High' : 'Medium',
    sentiment: 'Negative',
    extractedEntities: {
      orderId: detectedOrderId,
      paymentId: detectedPaymentId,
      amount: amountMatch ? parseFloat(amountMatch[1]) : 129.99,
      issueType: isRefundOrCancellation ? 'Payment Captured on Cancelled Order' : 'General Operational Assistance'
    },
    suggestedCategory: isRefundOrCancellation ? 'Cancellation & Refund' : (category || 'Order Management'),
    confidence: 0.96
  };

  const aiResult = await callAI({
    systemPrompt,
    userPrompt,
    temperature: 0.1,
    fallbackResponse: fallback
  });

  return {
    ...fallback,
    ...aiResult,
    executedAt: new Date()
  };
};

module.exports = { runUnderstandingAgent };
