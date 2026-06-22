import type { Product } from '../types';

export const capovane: Product[] = [
  {
    id: 'capovane-0',
    name: 'Krušovice Bohém',
    description: 'Čerstvo čapované pivo z pípy.',
    price: 2.2,
    image: '/images/tap/bohem.webp',
    type: 'capovane',
    allergens: ['1'],
    weight: '0,5l',
  },
  {
    id: 'capovane-1',
    name: 'Kofola Original',
    description: 'Originálna čapovaná Kofola.',
    price: 0.4,
    image: '/images/tap/kofola.webp',
    type: 'capovane',
    allergens: [],
    weight: '0,1l',
  },
  {
    id: 'capovane-2',
    name: 'Radler Citrón 0,0%',
    description: 'Čapovaný nealkoholický radler s citrónovou príchuťou.',
    price: 2.3,
    image: '/images/tap/radler.webp',
    type: 'capovane',
    allergens: ['1'],
    weight: '0,5l',
  },
];
