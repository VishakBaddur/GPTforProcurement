import suppliers from '../data/suppliers.json';

export interface VendorData {
  id: string;
  name: string;
  basePrice: number;
  minAcceptable: number;
  aggressiveness: number;
  warrantyMonths: number;
  maxDeliveryDays: number;
}

export function getMockVendors(): VendorData[] {
  return suppliers as VendorData[];
}

export function selectVendorsForAuction(requirements: any, count: number = 4): VendorData[] {
  const allVendors = getMockVendors();
  
  // Filter vendors that can potentially meet requirements
  const eligibleVendors = allVendors.filter(vendor => {
    const budgetOk = !requirements.budget || vendor.basePrice <= requirements.budget * 1.2; // Allow 20% over budget
    const deliveryOk = vendor.maxDeliveryDays <= requirements.deliveryDays * 1.5; // Allow 50% longer delivery
    return budgetOk && deliveryOk;
  });
  
  // If not enough eligible vendors, use all vendors
  const vendorsToUse = eligibleVendors.length >= count ? eligibleVendors : allVendors;
  
  // Randomly select vendors
  const shuffled = [...vendorsToUse].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function simulateVendorBehavior(vendor: VendorData, currentLowestBid: number, round: number): {
  willBid: boolean;
  newBid?: number;
  reason?: string;
} {
  // Probability to bid decreases over time
  const baseProbability = 0.8;
  const roundDecay = round * 0.05;
  const bidProbability = Math.max(0.3, baseProbability - roundDecay);
  
  if (Math.random() > bidProbability) {
    return {
      willBid: false,
      reason: 'Vendor is holding steady'
    };
  }
  
  // Calculate target price
  const aggressiveness = vendor.aggressiveness;
  const targetPrice = currentLowestBid * (1 - Math.random() * 0.02 * aggressiveness);
  const newBid = Math.max(targetPrice, vendor.minAcceptable);
  
  // Only bid if it's lower than current bid
  if (newBid >= vendor.basePrice) {
    return {
      willBid: false,
      reason: 'Price too high for vendor'
    };
  }
  
  return {
    willBid: true,
    newBid,
    reason: 'Competitive pricing strategy'
  };
}

export function generateVendorCommentary(vendor: VendorData, action: string, price?: number): string {
  const commentaries = {
    bid: [
      `${vendor.name} is aggressively pursuing this contract.`,
      `${vendor.name} sees an opportunity to win this business.`,
      `${vendor.name} is adjusting their strategy based on market conditions.`
    ],
    hold: [
      `${vendor.name} is carefully analyzing the competition.`,
      `${vendor.name} is waiting for the right moment to bid.`,
      `${vendor.name} is maintaining their current position.`
    ],
    win: [
      `${vendor.name} has secured the contract with excellent terms.`,
      `${vendor.name} won through competitive pricing and compliance.`,
      `${vendor.name} delivered the best value proposition.`
    ]
  };
  
  const options = commentaries[action as keyof typeof commentaries] || commentaries.hold;
  return options[Math.floor(Math.random() * options.length)];
}
