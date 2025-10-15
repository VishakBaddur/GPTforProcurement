import { NextRequest, NextResponse } from 'next/server';
import { parseRequest, validateSlots } from '../../../utils/parseRequest';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, contextSlots } = body;
    
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

    // Try Groq first; fall back to mock-style deterministic response on error
    let aiMessage: string | null = null;
    try {
      const apiKey = process.env.GROQ_API_KEY;
      if (apiKey) {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instruct',
            temperature: 0.2,
            max_tokens: 384,
            messages: [
              {
                role: 'system',
                content:
                  'You are Procurv\'s procurement copilot. Extract structured fields and then provide a short user-facing reply. First, produce a compact JSON object on the first line only with keys: item (string), quantity (number|null), budget (number|null), deliveryDays (number|null), warrantyMonths (number|null). After the JSON, add a single short sentence guiding next steps.'
              },
              { role: 'user', content: `Context so far: ${JSON.stringify(base)}\nUser message: ${text}` }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const raw = data.choices?.[0]?.message?.content || '';
          aiMessage = raw || null;
          // Try to extract JSON from the start of the message
          try {
            const start = raw.indexOf('{');
            const end = raw.lastIndexOf('}');
            if (start >= 0 && end > start) {
              const jsonStr = raw.slice(start, end + 1);
              const parsed = JSON.parse(jsonStr);
              if (parsed && typeof parsed === 'object') {
                // Map LLM fields to slot keys
                const llmSlots: any = {};
                if (parsed.item !== undefined) llmSlots.item = parsed.item;
                if (parsed.quantity !== undefined) llmSlots.quantity = Number(parsed.quantity) || null;
                if (parsed.budget !== undefined) {
                  llmSlots.budget = Number(parsed.budget) || null;
                  llmSlots.maxBudget = llmSlots.budget;
                }
                if (parsed.deliveryDays !== undefined) llmSlots.deliveryDays = Number(parsed.deliveryDays) || null;
                if (parsed.warrantyMonths !== undefined) llmSlots.warrantyMonths = Number(parsed.warrantyMonths) || undefined;
                Object.assign(base, llmSlots);
              }
            }
          } catch {}
        }
      }
    } catch (err) {
      console.warn('Groq call failed, falling back to local template.', err);
    }

    // If Groq not available or failed, generate a compact templated reply
    if (!aiMessage) {
      const missing: string[] = [];
      if (!slots.item) missing.push('item');
      if (!slots.quantity) missing.push('quantity');
      if (!slots.budget && !slots.maxBudget) missing.push('budget');
      if (!slots.deliveryDays) missing.push('delivery timeline');
      if (!slots.warrantyMonths && 'warrantyMonths' in (slots as any)) missing.push('warranty (months)');

      if (missing.length > 0) {
        aiMessage = `Great, we\'re close. I still need: ${missing.join(', ')}. You can continue typing the missing values. If you already have a vendor list, you can also upload it with the paperclip (CSV/JSON with columns supplier_name,email,base_price).`;
      } else {
        aiMessage = `Perfect. I can create the RFQ preview for ${slots.quantity} ${slots.item} (budget $${(slots.budget || slots.maxBudget)}, delivery in ${slots.deliveryDays} days).

Option A — Upload your vendor list now (paperclip).\nOption B — Start the reverse auction without a list (I\'ll use sample vendors for the demo).\n
Reply with “Upload” or “Start auction”.`;
      }
    }
    
    // Add telemetry (console log for demo)
    console.log('chat_message_submitted', { text, parsedSlots: slots });
    
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
