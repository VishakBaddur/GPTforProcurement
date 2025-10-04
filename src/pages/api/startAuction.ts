import { NextApiRequest, NextApiResponse } from 'next';
import { auctionEngine } from '../../utils/auctionEngine';
import { selectVendorsForAuction } from '../../utils/vendorSimulator';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { auctionId, options = {} } = req.body;
  
  if (!auctionId) {
    return res.status(400).json({ error: 'Auction ID is required' });
  }

  try {
    const auction = auctionEngine.getAuctionStatus(auctionId);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    // Select vendors for this auction
    const vendors = selectVendorsForAuction(auction.buyerSlots, options.vendorCount || 4);
    
    // Start the auction
    const success = auctionEngine.startAuction(auctionId, vendors);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to start auction' });
    }
    
    // Add telemetry
    console.log('auction_started', { auctionId, vendorCount: vendors.length });
    
    res.status(200).json({
      status: 'started',
      auctionId,
      vendorCount: vendors.length,
      vendors: vendors.map(v => ({ id: v.id, name: v.name }))
    });
  } catch (error) {
    console.error('Start auction error:', error);
    res.status(500).json({ error: 'Failed to start auction' });
  }
}
