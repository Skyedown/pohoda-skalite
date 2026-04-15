import type { Extra } from '../../../types';

export const defaultPizzaExtras: Extra[] = [
  { id: 'sunka', name: 'Šunka', price: 1.5 },
  { id: 'slanina', name: 'Slanina', price: 1.5 },
  { id: 'salama', name: 'Saláma', price: 1.5 },
  { id: 'klobasa', name: 'Klobása', price: 1.5 },
  { id: 'mozzarella', name: 'Extra mozzarella', price: 0.8 },
  { id: 'sampiony', name: 'Šampiňóny', price: 0.8 },
  { id: 'cierne-olivy', name: 'Čierne olivy', price: 0.8 },
  { id: 'rukola', name: 'Rukola', price: 0.8 },
  { id: 'chilli', name: 'Chilli papričky', price: 0.8 },
  { id: 'cervena-cibula', name: 'Červená cibuľa', price: 0.8 },
  { id: 'kukurica', name: 'Kukurica', price: 0.8 },
  { id: 'ananas', name: 'Ananás', price: 0.8 },
  { id: 'cherry-paradajky', name: 'Cherry paradajky', price: 0.8 },
];

export function calculateExtrasPrice(
  selectedExtras: string[],
  extras: Extra[],
): number {
  return selectedExtras.reduce((sum, extraId) => {
    const extra = extras.find((e) => e.id === extraId);
    return sum + (extra?.price || 0);
  }, 0);
}

export function calculateTotalPrice(
  basePrice: number,
  extrasPrice: number,
  quantity: number,
): number {
  return (basePrice + extrasPrice) * quantity;
}
