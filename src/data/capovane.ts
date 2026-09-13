import type { Product } from '../types';

export const capovane: Product[] = [
  {
    id: 'capovane-0',
    name: { sk: 'Krušovice Bohém', pl: 'Krušovice Bohém' },
    description: {
      sk: 'Čerstvo čapované pivo z pípy.',
      pl: 'Świeże piwo lane z beczki.',
    },
    price: { EUR: 2.2, PLN: 9.5 },
    image: '/images/tap/bohem.webp',
    type: 'capovane',
    allergens: ['1'],
    weight: '0,5l',
  },
  {
    id: 'capovane-1',
    name: { sk: 'Kofola Original', pl: 'Kofola Original' },
    description: {
      sk: 'Originálna čapovaná Kofola.',
      pl: 'Oryginalna Kofola lana z beczki.',
    },
    price: { EUR: 0.4, PLN: 1.7 },
    image: '/images/tap/kofola.webp',
    type: 'capovane',
    allergens: [],
    weight: '0,1l',
  },
  {
    id: 'capovane-2',
    name: { sk: 'Radler Citrón 0,0%', pl: 'Radler Cytrynowy 0,0%' },
    description: {
      sk: 'Čapovaný nealkoholický radler s citrónovou príchuťou.',
      pl: 'Bezalkoholowy radler cytrynowy lany z beczki.',
    },
    price: { EUR: 2.3, PLN: 10.0 },
    image: '/images/tap/radler.webp',
    type: 'capovane',
    allergens: ['1'],
    weight: '0,5l',
  },
];
