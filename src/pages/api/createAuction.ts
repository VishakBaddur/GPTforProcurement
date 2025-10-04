import { NextApiRequest, NextApiResponse } from 'next';
import { auctionEngine } from '../../utils/auctionEngine';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slots } = req.body;
  
  if (!slots) {
    return res.status(400).json({ error: 'Slots are required' });
  }

  try {
    const auctionId = auctionEngine.createAuction(slots);
    
    // Add telemetry
    console.log('auction_created', { auctionId, slots });
    
    res.status(200).json({
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
    res.status(500).json({ error: 'Failed to create auction' });
  }
}
