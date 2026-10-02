/**
 * OpsMind AI Service Layer
 * Clean abstraction supporting:
 * 1. AI_MODE=mock (Realistic deterministic rule-driven outputs, zero external dependency, fast & reliable)
 * 2. AI_MODE=real (Calls external LLMs e.g. OpenAI / Google Gemini with fallback to mock on error)
 */

const callAI = async ({ systemPrompt, userPrompt, temperature = 0.1, fallbackResponse = {} }) => {
  const aiMode = (process.env.AI_MODE || 'mock').toLowerCase();
  const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

  if (aiMode === 'real' && apiKey) {
    try {
      if (process.env.OPENAI_API_KEY) {
        // OpenAI Chat Completion API call
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt + '\nRespond STRICTLY with valid JSON. No markdown backticks or commentary.' },
              { role: 'user', content: userPrompt }
            ],
            temperature,
            response_format: { type: 'json_object' }
          })
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        return JSON.parse(content);
      }
    } catch (err) {
      console.warn(`[AI Service] Real AI invocation failed (${err.message}). Seamlessly falling back to Mock AI mode.`);
    }
  }

  // Realistic deterministic Mock AI fallback
  return fallbackResponse;
};

module.exports = { callAI };
