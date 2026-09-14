import type {
  LocalizedExtra,
  LocalizedProduct,
  DeliveryMethod,
} from '../../types';
import { adminFetch } from '../../utils/adminAuth';

// ============================================
// CONSTANTS
// ============================================

/** Admin-created orders are always Slovak, so extras carry plain Slovak labels. */
function skExtra(id: string, name: string, price: number): LocalizedExtra {
  return { id, name, nameSk: name, price, priceEur: price };
}

export const pizzaExtras: LocalizedExtra[] = [
  skExtra('sunka', 'Šunka', 1.5),
  skExtra('slanina', 'Slanina', 1.5),
  skExtra('salama', 'Saláma', 1.5),
  skExtra('klobasa', 'Klobása', 1.5),
  skExtra('mozzarella', 'Extra mozzarella', 0.8),
  skExtra('sampiony', 'Šampiňóny', 0.8),
  skExtra('cierne-olivy', 'Čierne olivy', 0.8),
  skExtra('rukola', 'Rukola', 0.8),
  skExtra('chilli', 'Chilli papričky', 0.8),
  skExtra('cervena-cibula', 'Červená cibuľa', 0.8),
  skExtra('kukurica', 'Kukurica', 0.8),
  skExtra('ananas', 'Ananás', 0.8),
  skExtra('cherry-paradajky', 'Cherry paradajky', 0.8),
];

export const burgerExtras: LocalizedExtra[] = [
  skExtra('extra-patty', 'Extra mäso', 4.5),
  skExtra('extra-cheddar', 'Extra cheddar', 1.2),
  skExtra('grilovan-encian', 'Grilovaný encián', 3.5),
  skExtra('slanina', 'Slanina', 1.5),
  skExtra('salat', 'Šalát', 0.8),
  skExtra('paradajka', 'Paradajka', 0.8),
  skExtra('karamelizona-cibuľka', 'Karamelizovaná cibuľka', 0.8),
  skExtra('kysla-uhorka', 'Kyslá uhorka', 0.8),
  skExtra('sampiony', 'Šampiňóny', 0.8),
  skExtra('cibuľka', 'Cibuľka', 0.8),
  skExtra('jalapeno', 'Jallapeño', 0.8),
  skExtra('baby-spenat', 'Baby špenát', 0.8),
  skExtra('volske-oko', 'Volské oko', 0.8),
];

export const langosExtras: LocalizedExtra[] = [
  skExtra('extra-cheese', 'Extra syr', 0.8),
  skExtra('ketchup', 'Kečup', 0.8),
  skExtra('tartar-sauce', 'Tatárska omáčka', 0.8),
  skExtra('sour-cream', 'Kyslá smotana', 0.8),
  skExtra('nutella', 'Nutella', 0.8),
  skExtra('banana', 'Banán', 0.8),
];

// Keep backward compatibility
export const defaultExtras = pizzaExtras;

/**
 * Get extras for a specific product type
 */
export const getExtrasForProductType = (
  productType: string,
): LocalizedExtra[] => {
  switch (productType) {
    case 'burger':
      return burgerExtras;
    case 'langos':
      return langosExtras;
    case 'pizza':
    default:
      return pizzaExtras;
  }
};

export const categoryLabels: Record<string, string> = {
  pizza: 'Pizze',
  burger: 'Burgre',
  langos: 'Langoše',
  sides: 'Prílohy',
  capovane: 'Čapované',
  drinks: 'Nápoje',
  snacks: 'Snacky',
};

// ============================================
// TYPES
// ============================================

export interface AdminOrderItem {
  product: LocalizedProduct;
  quantity: number;
  extras: LocalizedExtra[];
  removedIngredients?: string[];
}

export interface FormData {
  fullName: string;
  /** Only used when editing a Polish order; admin-created orders are Slovak. */
  street: string;
  houseNumber: string;
  city: string;
  phone: string;
  email: string;
  notes: string;
  deliveryMethod: DeliveryMethod;
}

export interface CustomerMatch {
  customer: {
    fullName: string;
    phone: string;
    email: string;
    city: string;
    houseNumber: string;
  };
  method: DeliveryMethod;
  lastOrderAt: string;
  orderCount: number;
}

// ============================================
// CALCULATION FUNCTIONS
// ============================================

/**
 * Calculate subtotal for all order items
 */
export const calculateSubtotal = (orderItems: AdminOrderItem[]): number => {
  return orderItems.reduce((sum, item) => {
    const extrasPrice = item.extras.reduce(
      (esum, extra) => esum + extra.price,
      0,
    );
    return sum + (item.product.price + extrasPrice) * item.quantity;
  }, 0);
};

/**
 * Calculate extras price for a single item
 */
export const calculateExtrasPrice = (extras: LocalizedExtra[]): number => {
  return extras.reduce((sum, extra) => sum + extra.price, 0);
};

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate order form based on order type
 */
export const validateOrderForm = (
  orderType: 'dine-in' | 'customer',
  formData: FormData,
  deliveryMethod: DeliveryMethod,
  orderItems: AdminOrderItem[],
  tenant: 'sk' | 'pl' = 'sk',
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // For dine-in orders, only validate that items are selected
  if (orderType === 'dine-in') {
    if (orderItems.length === 0) {
      errors.items = 'Musíte vybrať aspoň jeden produkt';
    }
  } else {
    // For customer orders, validate all fields
    if (!formData.phone.trim()) errors.phone = 'Telefón je povinný';

    if (deliveryMethod === 'delivery') {
      if (!formData.houseNumber.trim()) {
        errors.houseNumber = 'Číslo domu je povinné';
      } else if (
        tenant === 'sk' &&
        !/^[0-9]+$/.test(formData.houseNumber.trim())
      ) {
        errors.houseNumber = 'Číslo domu musí obsahovať len čísla';
      }
      if (tenant === 'pl' && !formData.street.trim()) {
        errors.street = 'Ulica je povinná';
      }
      if (!formData.city.trim()) errors.city = 'Mesto je povinné';
    }

    if (orderItems.length === 0) {
      errors.items = 'Musíte vybrať aspoň jeden produkt';
    }
  }

  return errors;
};

// ============================================
// ORDER PAYLOAD BUILDERS
// ============================================

/**
 * Build order payload for API submission
 */
export const buildOrderPayload = (
  orderItems: AdminOrderItem[],
  orderType: 'dine-in' | 'customer',
  formData: FormData,
  deliveryMethod: DeliveryMethod,
  paymentMethod: 'cash' | 'card',
  subtotal: number,
  deliveryFee: number,
  tenant: 'sk' | 'pl' = 'sk',
) => {
  return {
    items: orderItems.map((item) => ({
      product: {
        id: item.product.id,
        name: item.product.nameSk,
        nameLocalized: item.product.name,
        price: item.product.priceEur,
        priceDisplay: item.product.price,
        type: item.product.type,
      },
      quantity: item.quantity,
      extras: item.extras.map((extra) => ({
        id: extra.id,
        name: extra.nameSk,
        nameLocalized: extra.name,
        price: extra.priceEur,
        priceDisplay: extra.price,
      })),
      removedIngredients: item.removedIngredients || [],
      totalPrice:
        (item.product.price +
          item.extras.reduce((sum, e) => sum + e.price, 0)) *
        item.quantity,
      totalPriceDisplay:
        (item.product.price +
          item.extras.reduce((sum, e) => sum + e.price, 0)) *
        item.quantity,
    })),
    delivery:
      orderType === 'dine-in'
        ? {
            method: 'dine-in' as const,
            notes: formData.notes,
          }
        : {
            method: deliveryMethod,
            fullName: formData.fullName,
            street:
              deliveryMethod === 'delivery' && formData.street
                ? formData.street
                : undefined,
            houseNumber:
              deliveryMethod === 'delivery' ? formData.houseNumber : undefined,
            city: deliveryMethod === 'delivery' ? formData.city : undefined,
            phone: formData.phone,
            email: formData.email || undefined,
            notes: formData.notes,
          },
    payment: {
      method: paymentMethod,
    },
    pricing: {
      subtotal: subtotal,
      delivery: orderType === 'dine-in' ? 0 : deliveryFee,
      total: orderType === 'dine-in' ? subtotal : subtotal + deliveryFee,
    },
    // Admin orders are Slovak, so both figures are the same.
    pricingDisplay: {
      subtotal: subtotal,
      delivery: orderType === 'dine-in' ? 0 : deliveryFee,
      total: orderType === 'dine-in' ? subtotal : subtotal + deliveryFee,
    },
    createdBy: 'admin',
    tenant,
    // Admin orders are priced and charged in euros for both areas.
    currency: 'EUR' as const,
    displayCurrency: 'EUR' as const,
  };
};

// ============================================
// CUSTOMER LOOKUP
// ============================================

export interface CustomerLookupQuery {
  phone: string;
  name: string;
  city: string;
  houseNumber: string;
  email: string;
}

/**
 * Fetch returning-customer matches. Every provided field narrows the result
 * (logical AND), so matches include all details already filled in.
 */
export async function lookupCustomers(
  _apiUrl: string,
  query: CustomerLookupQuery,
  signal: AbortSignal,
): Promise<CustomerMatch[]> {
  const params = new URLSearchParams();
  if (query.phone) params.set('phone', query.phone);
  if (query.name) params.set('name', query.name);
  if (query.city) params.set('city', query.city);
  if (query.houseNumber) params.set('houseNumber', query.houseNumber);
  if (query.email) params.set('email', query.email);

  const res = await adminFetch(`/api/orders/lookup?${params.toString()}`, {
    signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data: { matches?: CustomerMatch[] } = await res.json();
  return data.matches || [];
}

// ============================================
// STATE MANAGEMENT HELPERS
// ============================================

/**
 * Get initial form state
 */
export const getInitialFormState = (): FormData => ({
  fullName: '',
  street: '',
  houseNumber: '',
  city: '',
  phone: '',
  email: '',
  notes: '',
  deliveryMethod: 'delivery',
});

/**
 * Handle product addition to order items
 */
export const addProductToOrder = (
  orderItems: AdminOrderItem[],
  product: LocalizedProduct,
): AdminOrderItem[] => {
  const existingIndex = orderItems.findIndex(
    (item) =>
      item.product.id === product.id &&
      item.extras.length === 0 &&
      (!item.removedIngredients || item.removedIngredients.length === 0),
  );

  if (existingIndex !== -1) {
    return orderItems.map((item, idx) =>
      idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item,
    );
  }

  return [...orderItems, { product, quantity: 1, extras: [] }];
};

/**
 * Handle extras confirmation with smart row splitting
 */
export const confirmExtras = (
  orderItems: AdminOrderItem[],
  editingItemIndex: number,
  tempSelectedExtras: string[],
  allExtras: LocalizedExtra[],
): AdminOrderItem[] => {
  const item = orderItems[editingItemIndex];
  if (!item) return orderItems;

  const selectedExtrasObjects = tempSelectedExtras.map(
    (extraId) => allExtras.find((e) => e.id === extraId)!,
  );

  // When quantity > 1 and extras change, split into two rows:
  // one row keeps (quantity - 1) with old extras,
  // new row gets quantity 1 with new extras.
  const extrasChanged =
    JSON.stringify(item.extras.map((e) => e.id).sort()) !==
    JSON.stringify([...tempSelectedExtras].sort());

  if (item.quantity > 1 && extrasChanged) {
    const reducedItem = { ...item, quantity: item.quantity - 1 };
    const newItem = {
      ...item,
      quantity: 1,
      extras: selectedExtrasObjects,
    };
    return [
      ...orderItems.slice(0, editingItemIndex),
      reducedItem,
      newItem,
      ...orderItems.slice(editingItemIndex + 1),
    ];
  }

  return orderItems.map((value, idx) =>
    idx === editingItemIndex
      ? { ...value, extras: selectedExtrasObjects }
      : value,
  );
};
