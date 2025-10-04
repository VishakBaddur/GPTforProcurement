import { NextRequest, NextResponse } from 'next/server';
import { auctionEngine } from '../../../utils/auctionEngine';
import { selectVendorsForAuction } from '../../../utils/vendorSimulator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { auctionId, options = {} } = body;
    
    if (!auctionId) {
      return NextResponse.json({ error: 'Auction ID is required' }, { status: 400 });
    }

    const auction = auctionEngine.getAuctionStatus(auctionId);
    if (!auction) {
      return NextResponse.json({ error: 'Auction not found' }, { status: 404 });
    }

    // Select vendors for this auction
    const vendors = selectVendorsForAuction(auction.buyerSlots, options.vendorCount || 4);
    
    // Start the auction
    const success = auctionEngine.startAuction(auctionId, vendors);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to start auction' }, { status: 500 });
    }
    
    // Add telemetry
    console.log('auction_started', { auctionId, vendorCount: vendors.length });
    
    return NextResponse.json({
      status: 'started',
      auctionId,
      vendorCount: vendors.length,
      vendors: vendors.map(v => ({ id: v.id, name: v.name }))
    });
  } catch (error) {
    console.error('Start auction error:', error);
    return NextResponse.json({ error: 'Failed to start auction' }, { status: 500 });
  }
}
