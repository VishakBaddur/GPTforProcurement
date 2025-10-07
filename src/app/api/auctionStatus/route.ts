import { NextRequest, NextResponse } from 'next/server';
import { auctionEngine } from '../../../utils/auctionEngine';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const auctionId = searchParams.get('auctionId');
    
    if (!auctionId) {
      return NextResponse.json({ error: 'Auction ID is required' }, { status: 400 });
    }

    const auction = auctionEngine.getAuctionStatus(auctionId);
    
    if (!auction) {
      return NextResponse.json({ error: 'Auction not found' }, { status: 404 });
    }

    // Get current leader
    const leader = auction.vendors && auction.vendors.length > 0 ? 
      auction.vendors.reduce((lowest, vendor) => 
        vendor.currentBid < lowest.currentBid ? vendor : lowest
      ) : null;

    // Get recent events (last 10)
    const recentEvents = auction.events.slice(-10);

    return NextResponse.json({
      status: auction.status,
      round: auction.rounds,
      leader: leader ? {
        id: leader.id,
        name: leader.name,
        bid: leader.currentBid,
        isCompliant: leader.isCompliant
      } : null,
      vendors: (auction.vendors || []).map(v => ({
        id: v.id,
        name: v.name,
        currentBid: v.currentBid,
        isCompliant: v.isCompliant,
        complianceScore: v.complianceScore,
        bidHistory: v.bidHistory.slice(-5) // Last 5 bids for sparkline
      })),
      events: recentEvents,
      totalBids: auction.bids.length,
      startedAt: auction.startedAt,
      endsAt: auction.endsAt
    });
  } catch (error) {
    console.error('Auction status error:', error);
    return NextResponse.json({ error: 'Failed to get auction status' }, { status: 500 });
  }
}
