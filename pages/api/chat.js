import palLogic from '../../ai/palLogic';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body || {};
    const text = typeof message === 'string' ? message.trim() : '';

    let reply = '';
    if (!text) {
      reply = palLogic.timeBasedGreetings();
    } else {
      reply = palLogic.processMessage(text);
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(500).json({ error: 'Failed to process message' });
  }
}