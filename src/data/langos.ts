import type { Pizza } from '../types';

export const langos: Pizza[] = [
  {
    id: 'langos-1',
    name: 'Cesnakový Langoš',
    description: 'Tradičný langoš s cesnakom',
    price: 3.0,
    image: '/images/langos.webp',
    ingredients: ['Cesnak'],
    allergens: ['1', '7'],
    badge: 'classic',
    type: 'langos',
  },
  {
    id: 'langos-2',
    name: 'Smotanový Lángoš',
    description:
      'Tradičný langoš s cesnakom, kyslou smotanou a syrom a jarnou cibuľkou alebo pažítkou podľa sezóny',
    price: 4.5,
    image: '/images/langos.webp',
    ingredients: [
      'Kyslá smotana',
      'cesnak',
      'syr',
      'Pažítka alebo jarná cibuľka (sezónne)',
    ],
    allergens: ['1', '7'],
    badge: 'classic',
    type: 'langos',
  },
  {
    id: 'langos-3',
    name: 'Lángoš Klasik',
    description: 'Lángoš s tatarskou alebo kečupom podľa vyýberu a syr',
    price: 4.5,
    image: '/images/langos.webp',
    ingredients: ['Kečup alebo Tatarka', 'Syr'],
    allergens: ['1', '3', '7'],
    badge: 'classic',
    type: 'langos',
  },
  {
    id: 'langos-4',
    name: 'Nutella Dream',
    description: 'Sladký langoš s Nutellou a čerstvým banánom',
    price: 4.5,
    image: '/images/langos.webp',
    ingredients: ['Nutella', 'Banán', 'Práškový cukor'],
    allergens: ['1', '7', '8'],
    type: 'langos',
  },
];
