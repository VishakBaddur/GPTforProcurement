import { ParsedSlots } from './parseRequest';

export interface AIResponse {
  action: 'clarify' | 'preview' | 'ok';
  message: string;
  slots?: ParsedSlots;
}

export function generateAIResponse(text: string, slots: ParsedSlots): AIResponse {
  // Simulate AI processing delay
  const processingTime = Math.random() * 600 + 600; // 600-1200ms
  
  // Check for auction-related questions (post-auction reasoning)
  const auctionKeywords = ['winner', 'decision', 'why', 'reason', 'price', 'final', 'conditions', 'compliance', 'auction', 'result'];
  const isAuctionQuestion = auctionKeywords.some(keyword => 
    text.toLowerCase().includes(keyword)
  );
  
  if (isAuctionQuestion) {
    const auctionResponses = [
      "The winner was selected based on the lowest compliant bid that met all your requirements. They offered the best price while maintaining full compliance with delivery and warranty terms.",
      "I chose this vendor because they provided the most competitive pricing while meeting all compliance criteria. Their bid was the lowest among vendors who could deliver within your timeline.",
      "The decision was based on a combination of factors: competitive pricing, compliance with your requirements, and delivery capability. This vendor offered the best overall value proposition.",
      "This vendor won because they met all your criteria at the lowest price point. They demonstrated full compliance with your delivery timeline and warranty requirements.",
      "The selection process prioritized vendors who could meet all your requirements. Among compliant vendors, this one offered the most competitive pricing for your procurement needs."
    ];
    
    return {
      action: 'ok',
      message: auctionResponses[Math.floor(Math.random() * auctionResponses.length)]
    };
  }
  
  // Check if we have enough information
  const hasItem = !!slots.item;
  const hasQuantity = !!slots.quantity;
  const hasBudget = !!(slots.budget || slots.maxBudget);
  const hasDelivery = !!slots.deliveryDays;
  
  // Count how many fields we have
  const fieldCount = [hasItem, hasQuantity, hasBudget, hasDelivery].filter(Boolean).length;
  
  // If we have at least 3 out of 4 fields, we're good to proceed
  if (fieldCount >= 3) {
    const confirmations = [
      "Perfect! I've parsed your procurement requirements. Let me set up a reverse auction for you.",
      "Got it! I understand your needs. Ready to start the auction process.",
      "Excellent! I've captured all the details. Time to find you the best deal.",
      "All set! Your requirements are clear. Let's get the best vendors competing for your business."
    ];
    
    return {
      action: 'preview',
      message: confirmations[Math.floor(Math.random() * confirmations.length)],
      slots
    };
  }
  
  // If we have 2 or more fields, ask for the most important missing one
  if (fieldCount >= 2) {
    if (!hasItem) {
      return {
        action: 'clarify',
        message: "What item or service are you looking to procure?"
      };
    }
    if (!hasQuantity) {
      return {
        action: 'clarify',
        message: "How many units do you need?"
      };
    }
    if (!hasBudget) {
      return {
        action: 'clarify',
        message: "What's your budget for this procurement?"
      };
    }
    if (!hasDelivery) {
      return {
        action: 'clarify',
        message: "When do you need delivery?"
      };
    }
  }
  
  // If we have less than 2 fields, ask for the most critical ones
  if (!hasItem) {
    return {
      action: 'clarify',
      message: "What item or service are you looking to procure?"
    };
  }
  
  if (!hasQuantity) {
    return {
      action: 'clarify',
      message: "How many units do you need?"
    };
  }
  
  if (!hasBudget) {
    return {
      action: 'clarify',
      message: "What's your budget for this procurement?"
    };
  }
  
  if (!hasDelivery) {
    return {
      action: 'clarify',
      message: "When do you need delivery?"
    };
  }
  
  // Fallback
  return {
    action: 'clarify',
    message: "I need a bit more information. Could you tell me what you're looking to procure, how many you need, your budget, and when you need delivery?"
  };
}

export function generateTypingMessage(): string {
  const messages = [
    "Analyzing your requirements...",
    "Processing procurement details...",
    "Setting up auction parameters...",
    "Preparing vendor matching..."
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}
