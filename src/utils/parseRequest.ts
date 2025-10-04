export interface ParsedSlots {
  item: string | null;
  quantity: number | null;
  budget: number | null;
  maxBudget: number | null;
  deliveryDays: number | null;
  warranty: string | null;
  warrantyMonths?: number;
}

export function parseRequest(text: string): ParsedSlots {
  const qtyMatch = text.match(/(\d{1,6})\s*(units|pieces|pcs|items)/i);
  const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : null;

  const budgetRangeMatch = text.match(/(?:budget|under|below|<=)\s*\$?(\d+(?:\.\d+)?)(?:\s*-\s*\$?(\d+(?:\.\d+)?))?/i);
  const budget = budgetRangeMatch ? parseFloat(budgetRangeMatch[1]) : null;
  const maxBudget = budgetRangeMatch && budgetRangeMatch[2] ? parseFloat(budgetRangeMatch[2]) : budget;

  const deliveryMatch = text.match(/(\d+)\s*(days|weeks)/i);
  const deliveryDays = deliveryMatch ? (deliveryMatch[2].toLowerCase().startsWith('week') ? parseInt(deliveryMatch[1])*7 : parseInt(deliveryMatch[1])) : null;

  const warrantyMatch = text.match(/(\d+)\s*(year|years|month|months)/i);
  const warrantyMonths = warrantyMatch ? 
    (warrantyMatch[2].toLowerCase().startsWith('year') ? parseInt(warrantyMatch[1]) * 12 : parseInt(warrantyMatch[1])) : 
    null;

  // Extract item description by removing quantity, budget, delivery, and warranty keywords
  const item = extractItemFromText(text);

  return { 
    item, 
    quantity: qty, 
    budget, 
    maxBudget, 
    deliveryDays, 
    warranty: warrantyMatch ? warrantyMatch[0] : null,
    warrantyMonths
  };
}

function extractItemFromText(text: string): string | null {
  // Remove common procurement keywords and numbers
  const cleaned = text
    .replace(/\b(?:need|want|require|looking for|procure|purchase|buy)\b/gi, '')
    .replace(/\b(?:budget|under|below|<=|delivery|warranty|days|weeks|months|years)\b/gi, '')
    .replace(/\b\d+\s*(?:units|pieces|pcs|items)\b/gi, '')
    .replace(/\$\d+(?:\.\d+)?/g, '')
    .replace(/\b\d+\s*(?:days|weeks|months|years)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned.length > 3 ? cleaned : null;
}

export function validateSlots(slots: ParsedSlots): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];
  
  if (!slots.item) missingFields.push('item');
  if (!slots.quantity) missingFields.push('quantity');
  if (!slots.budget && !slots.maxBudget) missingFields.push('budget');
  if (!slots.deliveryDays) missingFields.push('delivery timeframe');
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}
