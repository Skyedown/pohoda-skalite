export function getBadgeLabel(badge: string): string {
  const labels: Record<string, string> = {
    classic: 'NAŠA VOĽBA',
    premium: 'NAŠA VOĽBA',
    special: 'BESTSELLER',
  };
  return labels[badge] || '';
}
