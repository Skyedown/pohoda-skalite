/**
 * Seed script: fills the testing MongoDB with realistic orders.
 * Generates 40-55 orders per day for the previous calendar month.
 *
 * Run:  npx tsx seedOrders.ts
 * Wipe seeded docs first: npx tsx seedOrders.ts --reset
 *
 * Seeded docs carry `_seed: true` so they can be removed later without
 * touching real data.  Inserted via the native driver to bypass the
 * mongoose `timestamps` option (which would otherwise overwrite the
 * custom `createdAt` we assign to each order).
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

interface SeedProduct {
  id: string;
  name: string;
  price: number;
  type: string;
}

// Representative slice of the live catalogue (src/data/*.ts).
const PRODUCTS: SeedProduct[] = [
  { id: 'pizza-1', name: '1. Margherita', price: 8.0, type: 'pizza' },
  { id: 'pizza-2', name: '2. Prosciutto e Rucola', price: 11.0, type: 'pizza' },
  { id: 'pizza-3', name: '3. Prosciutto e Funghi', price: 9.0, type: 'pizza' },
  { id: 'pizza-4', name: '4. Quattro Formaggi', price: 10.0, type: 'pizza' },
  { id: 'pizza-5', name: '5. Diavola', price: 10.5, type: 'pizza' },
  { id: 'pizza-6', name: '6. Capricciosa', price: 10.0, type: 'pizza' },
  {
    id: 'burger-1',
    name: '1. Classic Cheeseburger',
    price: 12.0,
    type: 'burger',
  },
  {
    id: 'burger-2',
    name: '2. Classic Smash Burger',
    price: 12.5,
    type: 'burger',
  },
  { id: 'langos-1', name: '1. Cesnakový langoš', price: 3.5, type: 'langos' },
  { id: 'langos-2', name: '2. Smotanový langoš', price: 4.5, type: 'langos' },
  { id: 'prilohy-0', name: 'Klasické hranolky', price: 2.0, type: 'sides' },
  { id: 'prilohy-1', name: 'Batátové hranolky', price: 2.5, type: 'sides' },
  { id: 'drinks-0', name: 'Coca-Cola', price: 1.7, type: 'drinks' },
  { id: 'drinks-1', name: 'Coca-Cola Zero', price: 1.7, type: 'drinks' },
  { id: 'drinks-2', name: 'Fanta Pomaranč', price: 1.7, type: 'drinks' },
  { id: 'capovane-0', name: 'Krušovice Bohém', price: 2.2, type: 'capovane' },
  { id: 'capovane-1', name: 'Kofola Original', price: 0.4, type: 'capovane' },
  {
    id: 'snacks-0',
    name: 'Arašidy pražené solené',
    price: 1.5,
    type: 'snacks',
  },
];

// Extras only apply to pizzas/burgers/langos in the real UI.
const EXTRAS = [
  { id: 'extra-cheese', name: 'Extra syr', price: 1.0 },
  { id: 'extra-ham', name: 'Extra šunka', price: 1.5 },
  { id: 'extra-bacon', name: 'Slanina', price: 1.5 },
  { id: 'extra-jalapeno', name: 'Jalapeño', price: 0.8 },
];
const EXTRA_ELIGIBLE = new Set(['pizza', 'burger', 'langos']);

const FIRST_NAMES = [
  'Martin',
  'Jana',
  'Peter',
  'Zuzana',
  'Michal',
  'Katarína',
  'Tomáš',
  'Lucia',
  'Marek',
  'Eva',
  'Juraj',
  'Mária',
  'Milan',
  'Andrea',
  'Pavol',
];
const LAST_NAMES = [
  'Novák',
  'Kováč',
  'Horváth',
  'Varga',
  'Tóth',
  'Balog',
  'Szabó',
  'Molnár',
  'Baláž',
  'Lukáč',
  'Krupa',
  'Gajdoš',
  'Ondrejka',
];
const CITIES = [
  'Skalité',
  'Čadca',
  'Turzovka',
  'Krásno nad Kysucou',
  'Oščadnica',
];
const STREETS = [
  'Hlavná',
  'Kysucká',
  'Školská',
  'Družstevná',
  'Lesná',
  'Poľná',
  'Nová',
];
const NOTES = [
  '',
  '',
  '',
  'Zazvoňte 2x prosím',
  'Bez cibule',
  'Doručiť po 18:00',
  'Platba vopred',
];

const DELIVERY_FEE = 1.5;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function buildItem() {
  const product = pick(PRODUCTS);
  const quantity = randInt(1, 3);

  const extras =
    EXTRA_ELIGIBLE.has(product.type) && Math.random() < 0.35
      ? Array.from({ length: randInt(1, 2) }, () => pick(EXTRAS))
      : [];

  const unit = product.price + extras.reduce((s, e) => s + e.price, 0);
  const totalPrice = round2(unit * quantity);

  return {
    product: { ...product },
    quantity,
    extras,
    removedIngredients: [],
    totalPrice,
  };
}

function buildDelivery() {
  const method = pick(['delivery', 'delivery', 'pickup', 'dine-in'] as const);
  const fullName = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
  const phone = `+4219${randInt(10, 49)}${randInt(100000, 999999)}`;
  const email = `${fullName.split(' ')[0].toLowerCase()}${randInt(1, 99)}@example.sk`;

  if (method === 'delivery') {
    const city = pick(CITIES);
    return {
      method,
      fullName,
      street: pick(STREETS),
      houseNumber: String(randInt(1, 350)),
      city,
      phone,
      email,
      notes: pick(NOTES),
    };
  }
  return { method, fullName, phone, email, notes: pick(NOTES) };
}

function buildOrder(createdAt: Date, printNumber: number) {
  const items = Array.from({ length: randInt(1, 4) }, buildItem);
  const delivery = buildDelivery();
  const payment = { method: pick(['cash', 'cash', 'card'] as const) };

  const subtotal = round2(items.reduce((s, i) => s + i.totalPrice, 0));
  const deliveryFee = delivery.method === 'delivery' ? DELIVERY_FEE : 0;
  const total = round2(subtotal + deliveryFee);

  return {
    items,
    delivery,
    payment,
    pricing: { subtotal, delivery: deliveryFee, total },
    printed: true,
    printNumber,
    createdBy: Math.random() < 0.85 ? 'customer' : 'admin',
    createdAt,
    updatedAt: createdAt,
    _seed: true,
    __v: 0,
  };
}

// Distribute a day's orders across opening hours (11:00 - 22:00).
function timeForOrder(base: Date, index: number, count: number): Date {
  const openMin = 11 * 60;
  const closeMin = 22 * 60;
  const span = closeMin - openMin;
  const slot = openMin + Math.floor((span * index) / count) + randInt(-15, 15);
  const clamped = Math.max(openMin, Math.min(closeMin, slot));
  const d = new Date(base);
  d.setHours(Math.floor(clamped / 60), clamped % 60, randInt(0, 59), 0);
  return d;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in api/.env');

  await mongoose.connect(uri);
  const dbName = mongoose.connection.db?.databaseName;
  console.log(`✅ Connected to MongoDB (db: ${dbName})`);

  const collection = mongoose.connection.collection('orders');

  if (process.argv.includes('--reset')) {
    const { deletedCount } = await collection.deleteMany({ _seed: true });
    console.log(`🗑️  Removed ${deletedCount} previously seeded orders`);
  }

  // Previous calendar month relative to today.
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth(), 0); // last day of prev month
  const daysInMonth = monthEnd.getDate();

  const docs: ReturnType<typeof buildOrder>[] = [];
  let printCounter = 1;

  for (let day = 1; day <= daysInMonth; day++) {
    const ordersToday = randInt(40, 55);
    const base = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
    for (let i = 0; i < ordersToday; i++) {
      docs.push(buildOrder(timeForOrder(base, i, ordersToday), printCounter++));
    }
  }

  await collection.insertMany(docs);

  const label = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}`;
  console.log(
    `✅ Inserted ${docs.length} orders across ${daysInMonth} days of ${label}`,
  );
  console.log(`   (~${Math.round(docs.length / daysInMonth)} orders/day avg)`);

  await mongoose.disconnect();
  console.log('✅ Done');
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
