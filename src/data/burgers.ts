import type { Pizza } from '../types';

export const burgers: Pizza[] = [
  {
    id: 'burger-1',
    name: 'Burger',
    description: 'Šťavnatý burger s čerstvými ingredienciami',
    price: 5.50,
    image: '/images/pizza.png',
    ingredients: ['Hovädzí burger', 'Syr', 'Rajčina', 'Šalát', 'Cibuľa'],
    category: 'classic',
    type: 'burger'
  },
  {
    id: 'burger-2',
    name: 'Cheese Burger',
    description: 'Burger s extra syrom',
    price: 6.00,
    image: '/images/pizza.png',
    ingredients: ['Hovädzí burger', 'Dvojitý syr', 'Rajčina', 'Šalát'],
    category: 'classic',
    type: 'burger'
  },
  {
    id: 'burger-3',
    name: 'Bacon Burger',
    description: 'Burger so slaninou',
    price: 6.50,
    image: '/images/pizza.png',
    ingredients: ['Hovädzí burger', 'Slanina', 'Syr', 'Rajčina', 'Šalát'],
    category: 'premium',
    type: 'burger'
  },
];
