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

/**
 * Polish orders read "Street 12, Town"; Slovak village orders are just
 * "Village 123" because the houses carry no street name.
 */
export function formatAddress(
  street: string | undefined,
  houseNumber: string | undefined,
  city: string,
): string {
  const trimmedStreet = street?.trim();

  if (trimmedStreet) {
    return `${trimmedStreet} ${houseNumber ?? ''}, ${city}`.replace(' ,', ',');
  }

  return `${city} ${houseNumber ?? ''}`.trim();
}
