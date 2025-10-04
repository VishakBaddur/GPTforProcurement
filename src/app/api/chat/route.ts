import { NextRequest, NextResponse } from 'next/server';
import { parseRequest, validateSlots } from '../../../utils/parseRequest';
import { generateAIResponse } from '../../../utils/mockAI';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Parse the user input
    const slots = parseRequest(text);
    const validation = validateSlots(slots);
    
    // Generate AI response
    const aiResponse = generateAIResponse(text, slots);
    
    // Add telemetry (console log for demo)
    console.log('chat_message_submitted', { text, parsedSlots: slots });
    
    return NextResponse.json({
      action: aiResponse.action,
      message: aiResponse.message,
      slots: aiResponse.slots || null,
      validation
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
