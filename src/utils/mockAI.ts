import { ParsedSlots } from './parseRequest';

export interface AIResponse {
  action: 'clarify' | 'preview' | 'ok';
  message: string;
  slots?: ParsedSlots;
}

export function generateAIResponse(text: string, slots: ParsedSlots): AIResponse {
  // Simulate AI processing delay
  const processingTime = Math.random() * 600 + 600; // 600-1200ms
  
  // Check for "new auction" or reset keywords
  const resetKeywords = ['new auction', 'start new', 'new procurement', 'reset', 'start over', 'begin again'];
  const isResetRequest = resetKeywords.some(keyword => 
    text.toLowerCase().includes(keyword)
  );
  
  if (isResetRequest) {
    return {
      action: 'ok',
      message: "Great! Let's start fresh. What would you like to procure today? Please tell me about your procurement needs - what items, quantity, budget, and delivery timeline you're looking for."
    };
  }
  
  // Check for auction-related questions (post-auction reasoning)
  const auctionKeywords = [
    'winner', 'decision', 'why', 'reason', 'price', 'final', 'conditions', 'compliance', 
    'auction', 'result', 'selected', 'chose', 'compare', 'others', 'vendor', 'bid', 
    'delivery', 'warranty', 'terms', 'breakdown', 'explain', 'tell me about', 'how did',
    'what happened', 'outcome', 'details', 'information', 'analysis'
  ];
  const isAuctionQuestion = auctionKeywords.some(keyword => 
    text.toLowerCase().includes(keyword)
  );
  
  if (isAuctionQuestion) {
    // More diverse and contextual responses based on question type
    const priceQuestions = ['price', 'cost', 'bid', 'final price', 'how much'];
    const comparisonQuestions = ['compare', 'others', 'other vendors', 'versus', 'against'];
    const complianceQuestions = ['compliance', 'conditions', 'terms', 'requirements', 'meet'];
    const decisionQuestions = ['why', 'reason', 'decision', 'selected', 'chose', 'winner'];
    const generalQuestions = ['explain', 'tell me', 'what happened', 'outcome', 'result'];
    
    let response = '';
    
    if (priceQuestions.some(q => text.toLowerCase().includes(q))) {
      const priceResponses = [
        "The final winning bid was competitive and well within your budget. This vendor offered the best price-to-value ratio while meeting all your delivery and quality requirements.",
        "The pricing was determined through competitive bidding. The winner's final bid provided the most cost-effective solution while maintaining compliance with all your specifications.",
        "The final price reflects the market rate for your requirements. This vendor's bid was the most competitive among all compliant participants in the auction."
      ];
      response = priceResponses[Math.floor(Math.random() * priceResponses.length)];
    } else if (comparisonQuestions.some(q => text.toLowerCase().includes(q))) {
      const comparisonResponses = [
        "Compared to other vendors, this winner stood out for their combination of competitive pricing and full compliance. While others may have had lower prices, they couldn't meet all your requirements.",
        "The other vendors were competitive, but this winner provided the best overall package - meeting your budget, timeline, and quality standards simultaneously.",
        "Other vendors had their strengths, but this winner was the only one to consistently meet all your criteria while offering the most competitive pricing."
      ];
      response = comparisonResponses[Math.floor(Math.random() * comparisonResponses.length)];
    } else if (complianceQuestions.some(q => text.toLowerCase().includes(q))) {
      const complianceResponses = [
        "The winner met all compliance requirements including delivery timeline, warranty terms, and quality standards. They demonstrated full adherence to your procurement specifications.",
        "Compliance was a key factor in the selection. This vendor not only met but exceeded the minimum requirements for delivery, warranty, and quality assurance.",
        "The winner's compliance record was exemplary. They provided comprehensive documentation showing full adherence to your delivery, warranty, and quality requirements."
      ];
      response = complianceResponses[Math.floor(Math.random() * complianceResponses.length)];
    } else if (decisionQuestions.some(q => text.toLowerCase().includes(q))) {
      const decisionResponses = [
        "The winner was selected based on a comprehensive evaluation of price, compliance, and delivery capability. They offered the best overall value proposition for your needs.",
        "This vendor won because they provided the optimal balance of competitive pricing and full compliance with your requirements. They were the clear choice among all participants.",
        "The selection process prioritized vendors who could deliver on all fronts. This winner demonstrated superior performance in pricing, compliance, and delivery terms."
      ];
      response = decisionResponses[Math.floor(Math.random() * decisionResponses.length)];
    } else {
      // General auction responses
      const generalResponses = [
        "The auction was successful in finding you the best vendor for your needs. The winner provided competitive pricing while meeting all your requirements for delivery, quality, and compliance.",
        "The auction process worked as intended, creating competitive pressure among vendors. The final result gives you the best value for your procurement requirements.",
        "The auction outcome demonstrates the effectiveness of competitive bidding. You now have a vendor who meets all your criteria at the most competitive price point."
      ];
      response = generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }
    
    return {
      action: 'ok',
      message: response
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
  
  // Build contextual responses based on what we already know
  const contextualResponses = [];
  
  // Acknowledge what we have
  if (hasItem) contextualResponses.push(`${slots.quantity ? slots.quantity + ' ' : ''}${slots.item}`);
  if (hasQuantity && !hasItem) contextualResponses.push(`${slots.quantity} units`);
  if (hasBudget) contextualResponses.push(`budget of $${slots.budget || slots.maxBudget}`);
  if (hasDelivery) contextualResponses.push(`delivery in ${slots.deliveryDays} days`);
  
  const acknowledgment = contextualResponses.length > 0 ? 
    `Got it - ${contextualResponses.join(', ')}. ` : '';
  
  // If we have 2 or more fields, ask for the most important missing one with context
  if (fieldCount >= 2) {
    if (!hasItem) {
      return {
        action: 'clarify',
        message: `${acknowledgment}What specific item or service are you looking to procure?`
      };
    }
    if (!hasQuantity) {
      return {
        action: 'clarify',
        message: `${acknowledgment}How many ${slots.item || 'units'} do you need?`
      };
    }
    if (!hasBudget) {
      return {
        action: 'clarify',
        message: `${acknowledgment}What's your budget for ${slots.quantity ? slots.quantity + ' ' : ''}${slots.item || 'this procurement'}?`
      };
    }
    if (!hasDelivery) {
      return {
        action: 'clarify',
        message: `${acknowledgment}When do you need delivery for ${slots.quantity ? slots.quantity + ' ' : ''}${slots.item || 'this order'}?`
      };
    }
  }
  
  // If we have less than 2 fields, ask for the most critical ones with context
  if (!hasItem) {
    return {
      action: 'clarify',
      message: `${acknowledgment}What item or service are you looking to procure?`
    };
  }
  
  if (!hasQuantity) {
    return {
      action: 'clarify',
      message: `${acknowledgment}How many ${slots.item} do you need?`
    };
  }
  
  if (!hasBudget) {
    return {
      action: 'clarify',
      message: `${acknowledgment}What's your budget for ${slots.quantity ? slots.quantity + ' ' : ''}${slots.item}?`
    };
  }
  
  if (!hasDelivery) {
    return {
      action: 'clarify',
      message: `${acknowledgment}When do you need delivery for ${slots.quantity ? slots.quantity + ' ' : ''}${slots.item}?`
    };
  }
  
  // Fallback - provide more helpful guidance
  const fallbackMessages = [
    "I'd be happy to help you set up a procurement auction! To get started, I need a few details: what items you need, how many, your budget, and when you need delivery. For example: 'I need 50 office chairs under $200 each, delivered within 2 weeks.'",
    "Let me help you find the best vendors! Please tell me more about your procurement needs. I need to know: what you're buying, the quantity, your budget, and delivery timeline. You can say something like: 'I need 100 laptops under $800 each, delivered in 30 days.'",
    "I'm ready to set up a competitive auction for you! To get the best results, please provide: the items you need, quantity, budget, and delivery requirements. For example: 'I need 25 desks under $300 each, delivered within 3 weeks.'"
  ];
  
  return {
    action: 'clarify',
    message: fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)]
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
