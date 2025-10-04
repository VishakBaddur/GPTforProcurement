import { NextRequest, NextResponse } from 'next/server';
import { auctionEngine } from '../../../utils/auctionEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slots } = body;
    
    if (!slots) {
      return NextResponse.json({ error: 'Slots are required' }, { status: 400 });
    }

    const auctionId = auctionEngine.createAuction(slots);
    
    // Add telemetry
    console.log('auction_created', { auctionId, slots });
    
    return NextResponse.json({
      auctionId,
      summary: {
        item: slots.item,
        quantity: slots.quantity,
        budget: slots.budget || slots.maxBudget,
        deliveryDays: slots.deliveryDays,
        warrantyMonths: slots.warrantyMonths
      }
    });
  } catch (error) {
    console.error('Create auction error:', error);
    return NextResponse.json({ error: 'Failed to create auction' }, { status: 500 });
  }
}
