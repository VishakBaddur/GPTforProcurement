export const templates = [
  "Round {r}: {leader} in front at ${price}. {second} trails by {diff}%.",
  "{vendor} narrows the gap — ${delta} from parity.",
  "{vendor} maintains position with stronger compliance terms.",
  "Price improvement recorded: {vendor} reduces by ${delta}; {leader} remains ahead.",
  "{count} vendors active; orderly bidding continues.",
  "{vendor} holds at ${price} while the field adjusts.",
  "Market discovery progressing; values consolidating around the lead.",
  "All bids now inside the target range.",
  "Round {r}: {leader} leads at ${price}; {second} remains competitive ({diff}%).",
  "A reduction of ${delta} would place {vendor} ahead of {leader}."
];

export function generateCommentary(
  round: number,
  leader: string,
  leaderPrice: number,
  secondPlace?: string,
  secondPrice?: number,
  vendor?: string,
  vendorPrice?: number,
  delta?: number,
  gap?: number,
  warranty?: number,
  reqWarranty?: number,
  count?: number
): string {
  // Pick a random template
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Replace placeholders
  // Compute sensible deltas when we have two prices
  const computedDelta = (secondPrice && leaderPrice)
    ? Math.max(0, secondPrice - leaderPrice)
    : undefined;
  const computedDiffPct = (secondPrice && leaderPrice)
    ? (((secondPrice - leaderPrice) / leaderPrice) * 100)
    : undefined;

  return template
    .replace('{r}', round.toString())
    .replace('{leader}', leader)
    .replace('{price}', leaderPrice.toFixed(2))
    .replace('{second}', secondPlace || 'the next vendor')
    .replace('{diff}', computedDiffPct !== undefined ? computedDiffPct.toFixed(1) : '')
    .replace('{vendor}', vendor || 'A vendor')
    .replace('{delta}', (delta ?? computedDelta ?? 0).toFixed(2))
    .replace('{gap}', gap ? gap.toFixed(1) : '0')
    .replace('{warranty}', warranty?.toString() || '0')
    .replace('{reqWarranty}', reqWarranty?.toString() || '0')
    .replace('{count}', count?.toString() || '');
}

export function generateRoundStartCommentary(round: number, activeVendors: number): string {
  const templates = [
    `Round ${round} begins with ${activeVendors} active vendors.`,
    `Starting round ${round} — ${activeVendors} vendors are ready to compete.`,
    `Round ${round} is underway. ${activeVendors} vendors are participating.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

export function generateAuctionEndCommentary(winner: string, price: number, compliance: boolean): string {
  const templates = [
    `Auction complete! ${winner} wins with a compliant bid of $${price.toFixed(2)}.`,
    `Final result: ${winner} secured the contract at $${price.toFixed(2)} with full compliance.`,
    `Winner announced: ${winner} at $${price.toFixed(2)}. ${compliance ? 'All requirements met.' : 'Some compliance issues noted.'}`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}
