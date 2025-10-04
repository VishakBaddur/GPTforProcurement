import { NextApiRequest, NextApiResponse } from 'next';
import { parseRequest, validateSlots } from '../../utils/parseRequest';
import { generateAIResponse } from '../../utils/mockAI';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    // Parse the user input
    const slots = parseRequest(text);
    const validation = validateSlots(slots);
    
    // Generate AI response
    const aiResponse = generateAIResponse(text, slots);
    
    // Add telemetry (console log for demo)
    console.log('chat_message_submitted', { text, parsedSlots: slots });
    
    res.status(200).json({
      action: aiResponse.action,
      message: aiResponse.message,
      slots: aiResponse.slots || null,
      validation
    });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
}
