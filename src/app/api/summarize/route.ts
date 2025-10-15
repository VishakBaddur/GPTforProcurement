import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { round, topBids, context, leader, runnerUp, priceGap, complianceNotes } = body || {};

    // Build a prompt that answers the user's specific question
    const prompt = `You are a procurement analyst explaining auction results. Answer the user's question about why the winner was chosen.

User's question: "${context || 'Why was the winner chosen?'}"

Auction data:
- Round: ${round}
- Winner: ${leader?.vendor} at $${leader?.price} (${leader?.compliant ? 'compliant' : 'non-compliant'})
- Runner-up: ${runnerUp?.vendor} at $${runnerUp?.price} (${runnerUp?.compliant ? 'compliant' : 'non-compliant'})
- Price gap: $${priceGap}
- Top 5 bids: ${JSON.stringify(topBids)}
- Compliance notes: ${complianceNotes}

Provide a clear, detailed explanation of the reasoning behind the selection.`;

    let message: string | null = null;
    try {
      const apiKey = process.env.GROQ_API_KEY;
      if (apiKey) {
        const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instruct',
            temperature: 0.2,
            max_tokens: 512,
            messages: [
              { role: 'system', content: 'You are a helpful procurement analyst. Provide clear, detailed explanations of auction decisions based on the data provided.' },
              { role: 'user', content: prompt }
            ]
          })
        });
        if (resp.ok) {
          const data = await resp.json();
          message = data.choices?.[0]?.message?.content || null;
        }
      }
    } catch (err) {
      console.warn('Summarize: Groq failed, using fallback.', err);
    }

    if (!message) {
      // Fallback response
      message = `The winner (${leader?.vendor}) was selected based on the lowest bid of $${leader?.price}. ` +
        (runnerUp ? `The runner-up (${runnerUp.vendor}) bid $${runnerUp.price}, creating a $${priceGap} price gap. ` : '') +
        (leader?.compliant ? 'The winner is also compliant with all requirements. ' : '') +
        `This represents the best value proposition for the procurement.`;
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Summarize API error:', error);
    return NextResponse.json({ error: 'Failed to summarize' }, { status: 500 });
  }
}


