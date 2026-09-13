import type { Product } from '../types';
import { ING } from './ingredients';

export const langos: Product[] = [
  {
    id: 'langos-1',
    name: { sk: '1. Cesnakový langoš', pl: '1. Langosz czosnkowy' },
    price: { EUR: 3.5, PLN: 15.0 },
    image: '/images/langos/cesnak-langos.webp',
    ingredients: [ING.garlic],
    allergens: ['1', '7'],
    type: 'langos',
    weight: '170g',
  },
  {
    id: 'langos-2',
    name: { sk: '2. Smotanový langoš', pl: '2. Langosz śmietanowy' },
    price: { EUR: 4.5, PLN: 19.0 },
    image: '/images/langos/syr-smotana-langos.webp',
    ingredients: [ING.sourCream, ING.garlic, ING.cheese, ING.chivesSeasonal],
    allergens: ['1', '7'],
    badge: 'classic',
    type: 'langos',
    weight: '260g',
  },
  {
    id: 'langos-3',
    name: { sk: '3. Langoš klasik', pl: '3. Langosz klasyczny' },
    price: { EUR: 4.5, PLN: 19.0 },
    image: '/images/langos/classic-langos.webp',
    ingredients: [ING.ketchup, ING.tartarSauce, ING.cheese, ING.garlic],
    allergens: ['1', '3', '7'],
    type: 'langos',
    weight: '260g',
  },
  {
    id: 'langos-4',
    name: { sk: '4. Nutellový langoš', pl: '4. Langosz z Nutellą' },
    price: { EUR: 4.5, PLN: 19.0 },
    image: '/images/langos/nutella-dream.webp',
    ingredients: [ING.nutella, ING.banana, ING.icingSugar],
    allergens: ['1', '7', '8'],
    badge: 'special',
    type: 'langos',
    weight: '260g',
  },
];
