import type { Product } from '../types';

export const fried: Product[] = [
  {
    id: 'fried-1',
    name: {
      sk: 'Vyprážané olomoucké syrečky',
      pl: 'Smażone serki ołomunieckie',
    },
    description: { sk: '4 kusy', pl: '4 sztuki' },
    price: { EUR: 7.0, PLN: 30.0 },
    image: '/images/vyprazane/olomoucke.webp',
    allergens: ['1', '7'],
    type: 'fried',
    weight: '150g',
  },
  {
    id: 'fried-2',
    name: { sk: 'Vyprážaný syr', pl: 'Smażony ser' },
    price: { EUR: 6.5, PLN: 27.5 },
    image: '/images/vyprazane/vyprazany-syr.webp',
    allergens: ['1', '7'],
    type: 'fried',
    weight: '130g',
  },
];
