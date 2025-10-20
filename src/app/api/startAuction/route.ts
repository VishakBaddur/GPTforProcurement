import { NextRequest, NextResponse } from 'next/server';
import { auctionEngine } from '../../../utils/auctionEngine';
import { selectVendorsForAuction } from '../../../utils/vendorSimulator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { auctionId, options = {}, vendors: providedVendors } = body;
    
    if (!auctionId) {
      return NextResponse.json({ error: 'Auction ID is required' }, { status: 400 });
    }

    const auction = auctionEngine.getAuctionStatus(auctionId);
    if (!auction) {
      return NextResponse.json({ error: 'Auction not found' }, { status: 404 });
    }

    // Check if vendors are provided
    if (!Array.isArray(providedVendors) || providedVendors.length === 0) {
      return NextResponse.json({ 
        error: 'No vendors provided. Please upload a supplier list or add vendors before starting the auction.' 
      }, { status: 400 });
    }

    const vendorsRaw = providedVendors;

    // Normalize uploaded vendors so the engine can simulate bidding dynamics
    const vendors = vendorsRaw.map((v: any, idx: number) => {
      const basePrice = Number(v.base_price ?? v.basePrice ?? v.startingBid ?? v.price ?? 0);
      const name = v.name ?? v.vendor ?? v.supplier_name ?? `Vendor ${idx + 1}`;
      const id = v.id ?? v.email ?? `${idx + 1}`;
      const complianceScore = Number(v.complianceScore ?? v.compliance_score ?? 50);
      const aggressiveness = Number(v.aggressiveness ?? 0) || (0.05 + Math.random() * 0.07); // 0.05–0.12
      // Ensure vendors can actually reduce bids: minAcceptable 10–20% below base, but not negative
      const minAcceptable = Number(v.minAcceptable ?? v.min_acceptable ?? Math.max(0, basePrice * (0.8 + Math.random() * 0.1)));
      const maxDeliveryDays = Number(v.maxDeliveryDays ?? v.deliveryDays ?? 30);

      return {
        id: String(id),
        name,
        basePrice: basePrice || 50,
        minAcceptable,
        aggressiveness,
        complianceScore,
        maxDeliveryDays
      };
    });
    
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
