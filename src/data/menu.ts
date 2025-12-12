import type { Pizza } from '../types';

export const menuItems: Pizza[] = [
  // Pizzas
  {
    id: 'p1',
    name: 'Margherita',
    description:
      'Klasická napoletánska pizza s paradajkovou omáčkou a mozzarellou',
    price: 6.5,
    image: '/images/pizza.png',
    ingredients: [
      'Paradajková omáčka',
      'Mozzarella',
      'Bazalka',
      'Olivový olej',
    ],
    category: 'classic',
    type: 'pizza',
  },
  {
    id: 'p2',
    name: 'Prosciutto',
    description: 'Pizza so šunkou a syrom',
    price: 7.5,
    image: '/images/pizza.png',
    ingredients: ['Paradajková omáčka', 'Mozzarella', 'Šunka'],
    category: 'classic',
    type: 'pizza',
  },
  {
    id: 'p3',
    name: 'Salami',
    description: 'Pikantná pizza so salámou',
    price: 7.5,
    image: '/images/pizza.png',
    ingredients: ['Paradajková omáčka', 'Mozzarella', 'Saláma'],
    category: 'classic',
    type: 'pizza',
  },
  {
    id: 'p4',
    name: 'Quattro Formaggi',
    description: 'Pizza so štyrmi druhmi syrov',
    price: 8.5,
    image: '/images/pizza.png',
    ingredients: ['Mozzarella', 'Gorgonzola', 'Parmazán', 'Ementál'],
    category: 'premium',
    type: 'pizza',
  },
  {
    id: 'p5',
    name: 'Diavola',
    description: 'Ostrá pizza s pikantnou salámou',
    price: 8.0,
    image: '/images/pizza.png',
    ingredients: [
      'Paradajková omáčka',
      'Mozzarella',
      'Pikantná saláma',
      'Chilli',
    ],
    category: 'premium',
    type: 'pizza',
  },
  {
    id: 'p6',
    name: 'Vegetariana',
    description: 'Pizza so zeleninou',
    price: 7.5,
    image: '/images/pizza.png',
    ingredients: [
      'Paradajková omáčka',
      'Mozzarella',
      'Paprika',
      'Kukurica',
      'Olivy',
      'Šampiňóny',
    ],
    category: 'classic',
    type: 'pizza',
  },
  // Burgers
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
  // Langoš
  {
    id: 'langos-1',
    name: 'Langoš',
    description: 'Tradičný maďarský langoš',
    price: 5.50,
    image: '/images/pizza.png',
    ingredients: ['Cesto', 'Cesnak', 'Syr', 'Kečup'],
    category: 'classic',
    type: 'langos'
  },
];

// Drinks and snacks
export const drinksAndSnacks: Pizza[] = [
  {
    id: 'drink-1',
    name: 'Coca Cola',
    description: 'Osviežujúci nápoj 330ml',
    price: 1.75,
    image: '/images/pizza.png',
    ingredients: [],
    category: 'classic',
    type: 'burger'
  },
  {
    id: 'drink-2',
    name: 'Fanta',
    description: 'Pomarančový nápoj 330ml',
    price: 1.75,
    image: '/images/pizza.png',
    ingredients: [],
    category: 'classic',
    type: 'burger'
  },
  {
    id: 'drink-3',
    name: 'Natura neperlivá',
    description: 'Minerálka 500ml',
    price: 1.50,
    image: '/images/pizza.png',
    ingredients: [],
    category: 'classic',
    type: 'burger'
  },
  {
    id: 'drink-4',
    name: 'Rajec neperlivá',
    description: 'Minerálka 500ml',
    price: 1.50,
    image: '/images/pizza.png',
    ingredients: [],
    category: 'classic',
    type: 'burger'
  },
  {
    id: 'snack-1',
    name: 'Tyčinky Dru',
    description: 'Slané tyčinky 220g',
    price: 2.25,
    image: '/images/pizza.png',
    ingredients: [],
    category: 'classic',
    type: 'burger'
  },
  {
    id: 'drink-5',
    name: 'Sprite',
    description: 'Citrónový nápoj 330ml',
    price: 1.75,
    image: '/images/pizza.png',
    ingredients: [],
    category: 'classic',
    type: 'burger'
  },
  {
    id: 'drink-6',
    name: 'Kofola',
    description: 'Tradičný nápoj 330ml',
    price: 1.50,
    image: '/images/pizza.png',
    ingredients: [],
    category: 'classic',
    type: 'burger'
  },
  {
    id: 'drink-7',
    name: 'Tonic',
    description: 'Tonic water 250ml',
    price: 1.50,
    image: '/images/pizza.png',
    ingredients: [],
    category: 'classic',
    type: 'burger'
  },
];
