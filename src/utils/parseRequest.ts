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
  // More flexible quantity parsing - just look for numbers
  const qtyMatch = text.match(/(\d{1,6})(?:\s*(?:units|pieces|pcs|items|chairs|desks|tables|etc\.?))?/i);
  const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : null;

  // More flexible budget parsing
  const budgetPatterns = [
    /(?:budget|my budget)\s*(?:is\s*)?\$?(\d+(?:,\d{3})*(?:\.\d+)?)/i,
    /under\s*\$?(\d+(?:,\d{3})*(?:\.\d+)?)/i,
    /below\s*\$?(\d+(?:,\d{3})*(?:\.\d+)?)/i,
    /<=?\s*\$?(\d+(?:,\d{3})*(?:\.\d+)?)/i,
    /\$(\d+(?:,\d{3})*(?:\.\d+)?)/i
  ];
  
  let budget = null;
  for (const pattern of budgetPatterns) {
    const match = text.match(pattern);
    if (match) {
      budget = parseFloat(match[1].replace(/,/g, ''));
      break;
    }
  }

  // More flexible delivery parsing
  const deliveryPatterns = [
    /(\d+)\s*(?:days?|d)/i,
    /(\d+)\s*(?:weeks?|w)/i,
    /within\s*(\d+)\s*(?:days?|weeks?)/i,
    /in\s*(\d+)\s*(?:days?|weeks?)/i
  ];
  
  let deliveryDays = null;
  for (const pattern of deliveryPatterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseInt(match[1]);
      deliveryDays = text.toLowerCase().includes('week') ? value * 7 : value;
      break;
    }
  }

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
    warrantyMonths: warrantyMonths || undefined
  };
}

function extractItemFromText(text: string): string | null {
  // Common procurement items
  const commonItems = [
    'chairs', 'desks', 'tables', 'computers', 'laptops', 'monitors', 'printers',
    'phones', 'headsets', 'keyboards', 'mice', 'servers', 'storage', 'networking',
    'software', 'licenses', 'office supplies', 'stationery', 'furniture',
    'equipment', 'machinery', 'tools', 'vehicles', 'uniforms', 'safety gear'
  ];
  
  // First, try to find common items
  for (const item of commonItems) {
    if (text.toLowerCase().includes(item)) {
      return item;
    }
  }
  
  // Remove common procurement keywords and numbers
  const cleaned = text
    .replace(/\b(?:need|want|require|looking for|procure|purchase|buy|i want|i need)\b/gi, '')
    .replace(/\b(?:budget|my budget|under|below|<=|delivery|warranty|days|weeks|months|years)\b/gi, '')
    .replace(/\b\d+\s*(?:units|pieces|pcs|items|chairs|desks|tables)\b/gi, '')
    .replace(/\$\d+(?:,\d{3})*(?:\.\d+)?/g, '')
    .replace(/\b\d+\s*(?:days|weeks|months|years)\b/gi, '')
    .replace(/\b(?:within|in)\s*\d+\s*(?:days|weeks)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned.length > 2 ? cleaned : null;
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
