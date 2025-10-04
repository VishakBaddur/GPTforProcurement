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

    if (auction.status !== 'ended') {
      return NextResponse.json({ error: 'Auction has not ended yet' }, { status: 400 });
    }

    const results = auctionEngine.getAuctionResults(auctionId);
    
    if (!results) {
      return NextResponse.json({ error: 'Failed to get auction results' }, { status: 500 });
    }

    // Generate rationale
    const rationale = generateRationale(results, auction.buyerSlots);
    
    // Add telemetry
    console.log('auction_finalized', { 
      auctionId, 
      winnerId: results.winner.id, 
      amount: results.finalPrice 
    });
    
    return NextResponse.json({
      winner: {
        id: results.winner.id,
        name: results.winner.name,
        finalBid: results.finalPrice,
        isCompliant: results.compliance,
        warrantyMonths: results.winner.warrantyMonths,
        maxDeliveryDays: results.winner.maxDeliveryDays
      },
      rationale,
      auctionSummary: {
        totalRounds: results.totalRounds,
        totalBids: results.totalBids,
        duration: auction.startedAt && auction.endsAt ? 
          auction.endsAt.getTime() - auction.startedAt.getTime() : 0
      },
      poDetails: {
        poNumber: `PO-${Date.now().toString().slice(-6)}`,
        buyerName: 'Demo Company',
        buyerEmail: 'procurement@democompany.com',
        vendorName: results.winner.name,
        vendorEmail: `${results.winner.name.toLowerCase().replace(/\s+/g, '')}@vendor.com`,
        item: auction.buyerSlots.item,
        quantity: auction.buyerSlots.quantity,
        unitPrice: results.finalPrice,
        totalPrice: results.finalPrice * auction.buyerSlots.quantity,
        deliveryDays: results.winner.maxDeliveryDays,
        warrantyMonths: results.winner.warrantyMonths,
        orderDate: new Date().toLocaleDateString(),
        deliveryDate: new Date(Date.now() + results.winner.maxDeliveryDays * 24 * 60 * 60 * 1000).toLocaleDateString()
      }
    });
  } catch (error) {
    console.error('Results API error:', error);
    return NextResponse.json({ error: 'Failed to get auction results' }, { status: 500 });
  }
}

function generateRationale(results: any, requirements: any): string {
  const { winner, finalPrice, compliance } = results;
  
  let rationale = `${winner.name} won the auction with a final bid of $${finalPrice.toFixed(2)}. `;
  
  if (compliance) {
    rationale += `The vendor meets all compliance requirements including warranty (${winner.warrantyMonths} months) and delivery (${winner.maxDeliveryDays} days). `;
  } else {
    rationale += `Note: This vendor has some compliance issues but was selected based on price and overall score. `;
  }
  
  rationale += `The auction completed in ${results.totalRounds} rounds with ${results.totalBids} total bids, demonstrating competitive market dynamics.`;
  
  return rationale;
}
