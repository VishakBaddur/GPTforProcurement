import { NextRequest, NextResponse } from 'next/server';
import { parseRequest, validateSlots } from '../../../utils/parseRequest';

export async function POST(req: NextRequest) {
  console.log('=== /api/chat called ===');
  try {
    const body = await req.json();
    const { text, contextSlots } = body;
    console.log('Request body:', { text, contextSlots });
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Parse the user input
    const lower = String(text || '').toLowerCase();
    const slotsFromText = parseRequest(text);

    // Merge strategy: only overwrite fields that the user likely addressed
    const base = { ...(contextSlots || {}) } as any;
    const setIf = (key: keyof typeof base, cond: boolean) => {
      const val = (slotsFromText as any)[key];
      if (cond && val !== undefined && val !== null && val !== '') {
        (base as any)[key] = val;
      }
    };

    // Heuristics to decide which fields to accept from this turn
    const mentions = (kw: string) => lower.includes(kw);
    const saidBudget = mentions('budget') || lower.includes('$');
    const saidQty = mentions('qty') || mentions('quantity');
    const saidDelivery = mentions('delivery') || mentions('days');
    const saidWarranty = mentions('warranty');
    const saidItem = mentions('item') || mentions('product') || mentions('part') || mentions('laptop') || mentions('chair');

    // Only set fields the user is likely referring to this turn
    setIf('budget', saidBudget);
    setIf('maxBudget', saidBudget && (slotsFromText as any).maxBudget !== undefined);
    setIf('quantity', saidQty);
    setIf('deliveryDays', saidDelivery);
    setIf('warrantyMonths', saidWarranty);
    setIf('item', saidItem);

    // If message looks like a full spec sentence, accept all parsed
    const looksComplete = saidItem && (saidQty || (slotsFromText as any).quantity) && saidDelivery && saidBudget;
    if (looksComplete) {
      Object.assign(base, slotsFromText);
    }

    const slots = base;
    const validation = validateSlots(slots);

    // Always try Groq first - let the LLM decide how to respond
    let aiMessage: string | null = null;
    
    // Test if GROQ_API_KEY is working
    const apiKey = process.env.GROQ_API_KEY;
    console.log('=== GROQ_API_KEY TEST ===');
    console.log('GROQ_API_KEY exists:', !!apiKey);
    console.log('GROQ_API_KEY length:', apiKey?.length || 0);
    console.log('GROQ_API_KEY first 10 chars:', apiKey?.substring(0, 10) || 'undefined');
    
    try {
      
      if (apiKey) {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            temperature: 0.3,
            max_tokens: 512,
            messages: [
              {
                role: 'system',
                content: `You are Procurv's AI procurement assistant. 

If the user is asking about procurement (items, quantities, budgets, delivery, auctions), help them with procurement tasks and extract relevant details.

If they're just chatting (greetings, general questions), respond naturally and friendly.

Current context: ${JSON.stringify(base)}`
              },
              { role: 'user', content: text }
            ]
          })
        });

        console.log('Groq API response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          aiMessage = data.choices?.[0]?.message?.content || null;
          console.log('Groq response received:', aiMessage?.substring(0, 100) + '...');
        } else {
          const errorText = await response.text();
          console.log('Groq API error:', response.status, errorText);
        }
      }
    } catch (groqError) {
      console.log('Groq API call failed:', groqError);
    }
    
    // Try to extract procurement details from the response
    if (aiMessage) {
      try {
        const procurementKeywords = ['item', 'quantity', 'budget', 'delivery', 'warranty', 'laptop', 'chair', 'supplies'];
        const hasProcurementIntent = procurementKeywords.some(keyword => 
          text.toLowerCase().includes(keyword) || aiMessage?.toLowerCase().includes(keyword)
        );
        
        if (hasProcurementIntent) {
          // Try to extract structured data from the LLM response
          const extracted = parseRequest(text);
          if (extracted && Object.keys(extracted).length > 0) {
            Object.assign(base, extracted);
          }
        }
      } catch (extractError) {
        console.log('Error extracting procurement details:', extractError);
      }
    }

    // If still no message (Groq failed), generate a compact templated reply
    if (!aiMessage) {
      const missing: string[] = [];
      if (!slots.item) missing.push('item');
      if (!slots.quantity) missing.push('quantity');
      if (!slots.budget && !slots.maxBudget) missing.push('budget');
      if (!slots.deliveryDays) missing.push('delivery timeline');
      if (!slots.warrantyMonths && 'warrantyMonths' in slots) missing.push('warranty (months)');
      
      if (missing.length > 0) {
        aiMessage = `Great, we're close. I still need: ${missing.join(', ')}. You can continue typing the missing values. If you already have a vendor list, you can also upload it with the paperclip (CSV/JSON with columns supplier_name,email,base_price).`;
      } else {
        aiMessage = `Perfect. I can create the RFQ preview for ${slots.quantity} ${slots.item} (budget $${slots.budget || slots.maxBudget}, delivery in ${slots.deliveryDays} days).

Option A — Upload your vendor list now (paperclip).
Option B — Start the reverse auction without a list (I'll use sample vendors for the demo).

Reply with "Upload" or "Start auction".`;
      }
    }

    // Add telemetry (console log for demo)
    console.log('chat_message_submitted', {
      text,
      parsedSlots: slots
    });

    // Decide next action (preview if slots look good)
    const isReady = !!(slots.item && slots.quantity && (slots.budget || slots.maxBudget) && slots.deliveryDays);
    
    return NextResponse.json({
      action: isReady ? 'preview' : 'clarify',
      message: aiMessage,
      slots: slots || null,
      validation
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}