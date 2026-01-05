import type { Pizza } from '../types';

export const prilohy: Pizza[] = [
  {
    id: 'prilohy-1',
    name: 'Klasické hranolky',
    description: 'Chrumkavé zlatisté hranolky',
    price: 2.5,
    image: '/images/classic-fries.jpg',
    type: 'sides',
    ingredients: ['Zemiaky', 'Soľ'],
    allergens: [],
  },
  // {
  //   id: 'prilohy-2',
  //   name: 'Batatové hranolky',
  //   description: 'Sladké zemiaky so špeciálnym korením',
  //   price: 3.50,
  //   image: '/images/sweet-potato-fries.jpeg',
  //   type: 'sides',
  //   ingredients: ['Sladké zemiaky', 'Korenie', 'Soľ'],
  //   allergens: [],
  // },
];
