import type { Extra, Product, DeliveryMethod } from '../../types';

// ============================================
// CONSTANTS
// ============================================

export const pizzaExtras: Extra[] = [
  // Meat-based extras - 1.5 EUR
  { id: 'sunka', name: 'Šunka', price: 1.5 },
  { id: 'slanina', name: 'Slanina', price: 1.5 },
  { id: 'salama', name: 'Saláma', price: 1.5 },
  { id: 'klobasa', name: 'Klobása', price: 1.5 },
  // Non-meat extras - 0.80 EUR
  { id: 'mozzarella', name: 'Extra mozzarella', price: 0.8 },
  { id: 'sampiony', name: 'Šampiňóny', price: 0.8 },
  { id: 'cierne-olivy', name: 'Čierne olivy', price: 0.8 },
  { id: 'rukola', name: 'Rukola', price: 0.8 },
  { id: 'chilli', name: 'Chilli papričky', price: 0.8 },
  { id: 'cervena-cibula', name: 'Červená cibuľa', price: 0.8 },
  { id: 'kukurica', name: 'Kukurica', price: 0.8 },
  { id: 'ananas', name: 'Ananás', price: 0.8 },
  { id: 'cherry-paradajky', name: 'Cherry paradajky', price: 0.8 },
];

export const burgerExtras: Extra[] = [
  // Special extras
  { id: 'extra-patty', name: 'Extra mäso', price: 4.5 },
  { id: 'extra-cheddar', name: 'Extra cheddar', price: 1.2 },
  { id: 'grilovan-encian', name: 'Grilovaný encián', price: 3.5 },
  // Meat-based extras - 1.5 EUR
  { id: 'slanina', name: 'Slanina', price: 1.5 },
  // Non-meat extras - 0.80 EUR
  { id: 'salat', name: 'Šalát', price: 0.8 },
  { id: 'paradajka', name: 'Paradajka', price: 0.8 },
  { id: 'karamelizona-cibuľka', name: 'Karamelizovaná cibuľka', price: 0.8 },
  { id: 'kysla-uhorka', name: 'Kyslá uhorka', price: 0.8 },
  { id: 'sampiony', name: 'Šampiňóny', price: 0.8 },
  { id: 'cibuľka', name: 'Cibuľka', price: 0.8 },
  { id: 'jalapeno', name: 'Jallapeño', price: 0.8 },
  { id: 'baby-spenat', name: 'Baby špenát', price: 0.8 },
  { id: 'volske-oko', name: 'Volské oko', price: 0.8 },
];

export const langosExtras: Extra[] = [
  // All extras - 0.80 EUR
  { id: 'extra-cheese', name: 'Extra syr', price: 0.8 },
  { id: 'ketchup', name: 'Kečup', price: 0.8 },
  { id: 'tartar-sauce', name: 'Tatárska omáčka', price: 0.8 },
  { id: 'sour-cream', name: 'Kyslá smotana', price: 0.8 },
  { id: 'nutella', name: 'Nutella', price: 0.8 },
  { id: 'banana', name: 'Banán', price: 0.8 },
];

// Keep backward compatibility
export const defaultExtras = pizzaExtras;

/**
 * Get extras for a specific product type
 */
export const getExtrasForProductType = (productType: string): Extra[] => {
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
  pizza: 'Pizzy',
  burger: 'Burgery',
  langos: 'Langoš',
  sides: 'Prílohy',
};

// ============================================
// TYPES
// ============================================

export interface AdminOrderItem {
  product: Product;
  quantity: number;
  extras: Extra[];
}

export interface FormData {
  fullName: string;
  street: string;
  city: string;
  phone: string;
  email: string;
  notes: string;
  deliveryMethod: DeliveryMethod;
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
export const calculateExtrasPrice = (extras: Extra[]): number => {
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
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // For dine-in orders, only validate that items are selected
  if (orderType === 'dine-in') {
    if (orderItems.length === 0) {
      errors.items = 'Musíte vybrať aspoň jeden produkt';
    }
  } else {
    // For customer orders, validate all fields
    if (!formData.fullName.trim()) errors.fullName = 'Meno je povinné';
    if (!formData.phone.trim()) errors.phone = 'Telefón je povinný';

    if (deliveryMethod === 'delivery') {
      if (!formData.street.trim()) {
        errors.street = 'Číslo domu je povinné';
      } else if (!/^[0-9]+$/.test(formData.street.trim())) {
        errors.street = 'Číslo domu musí obsahovať len čísla';
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
) => {
  return {
    items: orderItems.map((item) => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        type: item.product.type,
      },
      quantity: item.quantity,
      extras: item.extras,
      totalPrice:
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
            street: deliveryMethod === 'delivery' ? formData.street : undefined,
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
    createdBy: 'admin',
  };
};

// ============================================
// STATE MANAGEMENT HELPERS
// ============================================

/**
 * Get initial form state
 */
export const getInitialFormState = (): FormData => ({
  fullName: '',
  street: '',
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
  product: Product,
): AdminOrderItem[] => {
  // Only merge with an existing row that has no extras
  const existingIndex = orderItems.findIndex(
    (item) => item.product.id === product.id && item.extras.length === 0,
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
  allExtras: Extra[],
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
