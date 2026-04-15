export function formatOrderDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('sk-SK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getDeliveryMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    delivery: 'Donáška',
    pickup: 'Vyzdvihnutie',
    'dine-in': 'V reštaurácii',
  };
  return labels[method] || method;
}

export function formatAddress(
  street: string | undefined,
  houseNumber: string | undefined,
  city: string,
): string {
  if (houseNumber) {
    return `${city} ${houseNumber}`;
  }
  return `${street}, ${city}`;
}
