const Prompt = require('../models/Prompt');

exports.getPrompts = async (req, res) => {
  try {
    const { agentName } = req.query;
    const filter = {};
    if (agentName) filter.agentName = agentName;

    const prompts = await Prompt.find(filter).sort({ agentName: 1, promptVersion: -1 });
    res.json({ success: true, count: prompts.length, data: prompts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPrompt = async (req, res) => {
  try {
    const prompt = await Prompt.create(req.body);
    res.status(201).json({ success: true, data: prompt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.comparePrompts = async (req, res) => {
  try {
    const { promptV1Id, promptV2Id, testInput } = req.body;
    res.json({
      success: true,
      data: {
        v1: {
          output: 'The customer order is cancelled and funds were collected. Recommendation is to refund $129.99.',
          groundedness: 72,
          latencyMs: 380
        },
        v2: {
          output: 'EVIDENCE: OMS confirms ORD-9821 cancelled; PG confirms TXN-4921 captured $129.99.\nGROUNDING: Applies POL-101 Section 3.1.\nACTION: Auto-execute full refund.',
          groundedness: 98,
          latencyMs: 270
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPromptVersion = exports.createPrompt;

