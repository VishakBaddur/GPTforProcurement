export interface Vendor {
  id: string;
  name: string;
  basePrice: number;
  minAcceptable: number;
  aggressiveness: number;
  warrantyMonths: number;
  maxDeliveryDays: number;
  currentBid: number;
  bidHistory: number[];
  isCompliant: boolean;
  complianceScore: number;
}

export interface Auction {
  id: string;
  buyerSlots: {
    item: string;
    quantity: number;
    budget: number;
    maxBudget?: number;
    deliveryDays: number;
    warrantyMonths?: number;
  };
  status: 'draft' | 'live' | 'ended';
  rounds: number;
  roundIntervalMs: number;
  maxRounds: number;
  startedAt: Date | null;
  endsAt: Date | null;
  vendors: Vendor[];
  bids: Bid[];
  events: AuctionEvent[];
}

export interface Bid {
  vendorId: string;
  amount: number;
  round: number;
  timestamp: Date;
  isCompliant: boolean;
}

export interface AuctionEvent {
  type: 'vendor_joined' | 'bid_submitted' | 'leader_changed' | 'round_started' | 'round_ended' | 'auction_finalized';
  vendorId?: string;
  amount?: number;
  round?: number;
  timestamp: Date;
  message: string;
}

export class AuctionEngine {
  private auctions: Map<string, Auction> = new Map();
  
  createAuction(buyerSlots: any): string {
    const auctionId = `auction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const auction: Auction = {
      id: auctionId,
      buyerSlots,
      status: 'draft',
      rounds: 0,
      roundIntervalMs: 2000, // 2 seconds per round
      maxRounds: 10,
      startedAt: null,
      endsAt: null,
      vendors: [],
      bids: [],
      events: []
    };
    
    this.auctions.set(auctionId, auction);
    return auctionId;
  }
  
  startAuction(auctionId: string, vendors: any[]): boolean {
    const auction = this.auctions.get(auctionId);
    if (!auction) return false;
    
    // Initialize vendors
    auction.vendors = vendors.map(v => ({
      ...v,
      currentBid: v.basePrice,
      bidHistory: [v.basePrice],
      isCompliant: this.checkCompliance(v, auction.buyerSlots),
      complianceScore: this.calculateComplianceScore(v, auction.buyerSlots)
    }));
    
    auction.status = 'live';
    auction.startedAt = new Date();
    auction.endsAt = new Date(Date.now() + auction.maxRounds * auction.roundIntervalMs);
    
    // Add initial bids
    auction.vendors.forEach(vendor => {
      auction.bids.push({
        vendorId: vendor.id,
        amount: vendor.currentBid,
        round: 0,
        timestamp: new Date(),
        isCompliant: vendor.isCompliant
      });
    });
    
    // Start the auction loop
    this.runAuctionLoop(auctionId);
    
    return true;
  }
  
  private async runAuctionLoop(auctionId: string) {
    const auction = this.auctions.get(auctionId);
    if (!auction || auction.status !== 'live') return;
    
    const interval = setInterval(() => {
      if (auction.status !== 'live') {
        clearInterval(interval);
        return;
      }
      
      this.runRound(auctionId);
      
      if (auction.rounds >= auction.maxRounds) {
        this.finalizeAuction(auctionId);
        clearInterval(interval);
      }
    }, auction.roundIntervalMs);
  }
  
  private runRound(auctionId: string) {
    const auction = this.auctions.get(auctionId);
    if (!auction) return;
    
    auction.rounds++;
    auction.events.push({
      type: 'round_started',
      round: auction.rounds,
      timestamp: new Date(),
      message: `Round ${auction.rounds} started`
    });
    
    const currentLowest = Math.min(...auction.vendors.map(v => v.currentBid));
    let leaderChanged = false;
    let previousLeader = this.getCurrentLeader(auction);
    
    auction.vendors.forEach(vendor => {
      if (Math.random() < 0.8) { // 80% chance to bid
        const targetPrice = currentLowest * (1 - Math.random() * 0.02 * vendor.aggressiveness);
        const newBid = Math.max(targetPrice, vendor.minAcceptable);
        
        if (newBid < vendor.currentBid - 0.01) {
          vendor.currentBid = newBid;
          vendor.bidHistory.push(newBid);
          
          auction.bids.push({
            vendorId: vendor.id,
            amount: newBid,
            round: auction.rounds,
            timestamp: new Date(),
            isCompliant: vendor.isCompliant
          });
          
          auction.events.push({
            type: 'bid_submitted',
            vendorId: vendor.id,
            amount: newBid,
            round: auction.rounds,
            timestamp: new Date(),
            message: `${vendor.name} bid $${newBid.toFixed(2)}`
          });
        }
      }
    });
    
    const newLeader = this.getCurrentLeader(auction);
    if (newLeader && newLeader !== previousLeader) {
      leaderChanged = true;
      auction.events.push({
        type: 'leader_changed',
        vendorId: newLeader,
        timestamp: new Date(),
        message: `${auction.vendors.find(v => v.id === newLeader)?.name} is now leading`
      });
    }
    
    auction.events.push({
      type: 'round_ended',
      round: auction.rounds,
      timestamp: new Date(),
      message: `Round ${auction.rounds} completed`
    });
  }
  
  private getCurrentLeader(auction: Auction): string | null {
    if (auction.vendors.length === 0) return null;
    
    return auction.vendors.reduce((lowest, vendor) => 
      vendor.currentBid < lowest.currentBid ? vendor : lowest
    ).id;
  }
  
  private finalizeAuction(auctionId: string) {
    const auction = this.auctions.get(auctionId);
    if (!auction) return;
    
    auction.status = 'ended';
    
    // Select winner based on compliance and price
    const compliantBids = auction.vendors.filter(v => v.isCompliant);
    let winner: Vendor;
    
    if (compliantBids.length > 0) {
      winner = compliantBids.reduce((lowest, vendor) => 
        vendor.currentBid < lowest.currentBid ? vendor : lowest
      );
    } else {
      // Fall back to compliance-weighted selection
      winner = auction.vendors.reduce((best, vendor) => {
        const bestScore = best.complianceScore * 1000 - best.currentBid;
        const vendorScore = vendor.complianceScore * 1000 - vendor.currentBid;
        return vendorScore > bestScore ? vendor : best;
      });
    }
    
    auction.events.push({
      type: 'auction_finalized',
      vendorId: winner.id,
      amount: winner.currentBid,
      timestamp: new Date(),
      message: `Auction ended. Winner: ${winner.name} at $${winner.currentBid.toFixed(2)}`
    });
  }
  
  private checkCompliance(vendor: any, requirements: any): boolean {
    const warrantyOk = !requirements.warrantyMonths || vendor.warrantyMonths >= requirements.warrantyMonths;
    const deliveryOk = vendor.maxDeliveryDays <= requirements.deliveryDays;
    return warrantyOk && deliveryOk;
  }
  
  private calculateComplianceScore(vendor: any, requirements: any): number {
    let score = 0;
    
    if (!requirements.warrantyMonths || vendor.warrantyMonths >= requirements.warrantyMonths) {
      score += 10;
    }
    
    if (vendor.maxDeliveryDays <= requirements.deliveryDays) {
      score += 8;
    }
    
    return score;
  }
  
  getAuctionStatus(auctionId: string) {
    return this.auctions.get(auctionId);
  }
  
  getAuctionResults(auctionId: string) {
    const auction = this.auctions.get(auctionId);
    if (!auction || auction.status !== 'ended') return null;
    
    const winner = auction.vendors.reduce((lowest, vendor) => 
      vendor.currentBid < lowest.currentBid ? vendor : lowest
    );
    
    return {
      winner,
      finalPrice: winner.currentBid,
      totalRounds: auction.rounds,
      totalBids: auction.bids.length,
      compliance: winner.isCompliant
    };
  }
}

// Singleton instance
export const auctionEngine = new AuctionEngine();
