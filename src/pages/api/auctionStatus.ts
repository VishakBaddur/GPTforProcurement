import { NextApiRequest, NextApiResponse } from 'next';
import { auctionEngine } from '../../utils/auctionEngine';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { auctionId } = req.query;
  
  if (!auctionId || typeof auctionId !== 'string') {
    return res.status(400).json({ error: 'Auction ID is required' });
  }

  try {
    const auction = auctionEngine.getAuctionStatus(auctionId);
    
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    // Get current leader
    const leader = auction.vendors.length > 0 ? 
      auction.vendors.reduce((lowest, vendor) => 
        vendor.currentBid < lowest.currentBid ? vendor : lowest
      ) : null;

    // Get recent events (last 10)
    const recentEvents = auction.events.slice(-10);

    res.status(200).json({
      status: auction.status,
      round: auction.rounds,
      leader: leader ? {
        id: leader.id,
        name: leader.name,
        bid: leader.currentBid,
        isCompliant: leader.isCompliant
      } : null,
      vendors: auction.vendors.map(v => ({
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
    res.status(500).json({ error: 'Failed to get auction status' });
  }
}
