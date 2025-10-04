export const templates = [
  "Round {r}: {leader} leads at ${price}, {diff}% below average.",
  "{vendor} is closing in — now only ${delta} behind.",
  "{vendor} holds strong with best compliance terms.",
  "Competition is heating up! {vendor} just undercut {leader} by ${delta}.",
  "The market is responding well to your requirements. {count} vendors are actively competing.",
  "{vendor} is holding steady at ${price} while others adjust their strategies.",
  "Price discovery is working — we're seeing realistic market valuations.",
  "All vendors are now within your budget range. Great procurement strategy!",
  "Round {r}: {leader} leads at ${price}. {second} is {diff}% behind.",
  "If {vendor} drops ${delta}, they will overtake {leader}."
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
  return template
    .replace('{r}', round.toString())
    .replace('{leader}', leader)
    .replace('{price}', leaderPrice.toFixed(2))
    .replace('{second}', secondPlace || 'the next vendor')
    .replace('{diff}', secondPrice ? ((secondPrice - leaderPrice) / leaderPrice * 100).toFixed(1) : '0')
    .replace('{vendor}', vendor || 'A vendor')
    .replace('{delta}', delta ? delta.toFixed(2) : '0')
    .replace('{gap}', gap ? gap.toFixed(1) : '0')
    .replace('{warranty}', warranty?.toString() || '0')
    .replace('{reqWarranty}', reqWarranty?.toString() || '0')
    .replace('{count}', count?.toString() || '0');
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
