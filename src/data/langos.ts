import type { Pizza } from '../types';

export const langos: Pizza[] = [
  {
    id: 'langos-1',
    name: 'Klasický Langoš',
    description: 'Tradičný langoš s cesnakom, kyslou smotanou a syrom',
    price: 5.5,
    image: '/images/langos.webp',
    ingredients: ['Cesnak', 'Kyslá smotana', 'Strúhaný syr'],
    badge: 'classic',
    type: 'langos',
  },
  {
    id: 'langos-2',
    name: 'Pikantný Langoš "Diablo"',
    description: 'Ostrý langoš s jalapeño, pikantnou salámou a chili olejom',
    price: 5.5,
    image: '/images/langos.webp',
    ingredients: [
      'Cesnak',
      'Kyslá smotana',
      'Syr',
      'Jalapeño',
      'Pikantná saláma',
      'Chili olej',
    ],
    badge: 'premium',
    type: 'langos',
  },
  {
    id: 'langos-3',
    name: 'Kysucký Langoš',
    description:
      'Náš špeciálny langoš s bryndzou, údenou slaninou a karamelizovanou cibuľkou',
    price: 5.5,
    image: '/images/langos.webp',
    ingredients: [
      'Cesnak',
      'Kyslá smotana',
      'Bryndza',
      'Údená slanina',
      'Karamelizovaná cibuľka',
      'Pažítka',
    ],
    badge: 'special',
    type: 'langos',
  },
  {
    id: 'langos-4',
    name: 'Nutella Dream',
    description: 'Sladký langoš s Nutellou a čerstvým banánom',
    price: 5.5,
    image: '/images/langos.webp',
    ingredients: ['Nutella', 'Banán', 'Práškový cukor'],
    type: 'langos',
  },
];
