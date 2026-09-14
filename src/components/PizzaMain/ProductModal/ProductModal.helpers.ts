import type { Extra, LocalizedExtra } from '../../../types';

export const defaultPizzaExtras: Extra[] = [
  {
    id: 'sunka',
    name: { sk: 'Šunka', pl: 'Szynka' },
    price: { EUR: 1.5, PLN: 6.5 },
  },
  {
    id: 'slanina',
    name: { sk: 'Slanina', pl: 'Boczek' },
    price: { EUR: 1.5, PLN: 6.5 },
  },
  {
    id: 'salama',
    name: { sk: 'Saláma', pl: 'Salami' },
    price: { EUR: 1.5, PLN: 6.5 },
  },
  {
    id: 'klobasa',
    name: { sk: 'Klobása', pl: 'Kiełbasa' },
    price: { EUR: 1.5, PLN: 6.5 },
  },
  {
    id: 'mozzarella',
    name: { sk: 'Extra mozzarella', pl: 'Extra mozzarella' },
    price: { EUR: 0.8, PLN: 3.4 },
  },
  {
    id: 'sampiony',
    name: { sk: 'Šampiňóny', pl: 'Pieczarki' },
    price: { EUR: 0.8, PLN: 3.4 },
  },
  {
    id: 'cierne-olivy',
    name: { sk: 'Čierne olivy', pl: 'Czarne oliwki' },
    price: { EUR: 0.8, PLN: 3.4 },
  },
  {
    id: 'rukola',
    name: { sk: 'Rukola', pl: 'Rukola' },
    price: { EUR: 0.8, PLN: 3.4 },
  },
  {
    id: 'chilli',
    name: { sk: 'Chilli papričky', pl: 'Papryczki chilli' },
    price: { EUR: 0.8, PLN: 3.4 },
  },
  {
    id: 'cervena-cibula',
    name: { sk: 'Červená cibuľa', pl: 'Czerwona cebula' },
    price: { EUR: 0.8, PLN: 3.4 },
  },
  {
    id: 'kukurica',
    name: { sk: 'Kukurica', pl: 'Kukurydza' },
    price: { EUR: 0.8, PLN: 3.4 },
  },
  {
    id: 'ananas',
    name: { sk: 'Ananás', pl: 'Ananas' },
    price: { EUR: 0.8, PLN: 3.4 },
  },
  {
    id: 'cherry-paradajky',
    name: { sk: 'Cherry paradajky', pl: 'Pomidorki cherry' },
    price: { EUR: 0.8, PLN: 3.4 },
  },
];

export function calculateExtrasPrice(
  selectedExtras: string[],
  extras: LocalizedExtra[],
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
