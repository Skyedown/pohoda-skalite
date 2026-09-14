import type { Locale } from '../i18n/types';
import type {
  Extra,
  LocalizedExtra,
  LocalizedProduct,
  Product,
} from '../types';
import { pickPrice, pickText } from '../i18n/format';

export function localizeProduct(
  product: Product,
  locale: Locale,
): LocalizedProduct {
  return {
    id: product.id,
    name: pickText(product.name, locale),
    nameSk: product.name.sk,
    description: product.description
      ? pickText(product.description, locale)
      : undefined,
    price: pickPrice(product.price, locale),
    priceEur: product.price.EUR,
    image: product.image,
    ingredients: product.ingredients?.map((item) => pickText(item, locale)),
    ingredientsSk: product.ingredients?.map((item) => item.sk),
    allergens: product.allergens,
    badge: product.badge,
    type: product.type,
    weight: product.weight,
    spicy: product.spicy,
  };
}

export function localizeProducts(
  products: Product[],
  locale: Locale,
): LocalizedProduct[] {
  return products.map((product) => localizeProduct(product, locale));
}

export function localizeExtra(extra: Extra, locale: Locale): LocalizedExtra {
  return {
    id: extra.id,
    name: pickText(extra.name, locale),
    nameSk: extra.name.sk,
    price: pickPrice(extra.price, locale),
    priceEur: extra.price.EUR,
  };
}

export function localizeExtras(
  extras: Extra[],
  locale: Locale,
): LocalizedExtra[] {
  return extras.map((extra) => localizeExtra(extra, locale));
}

/**
 * Maps a removed-ingredient label back to its Slovak counterpart so the kitchen
 * ticket never prints Polish.
 */
export function toSlovakIngredients(
  removed: string[],
  product: LocalizedProduct,
): string[] {
  const { ingredients = [], ingredientsSk = [] } = product;
  return removed.map((label) => {
    const index = ingredients.indexOf(label);
    return index === -1 ? label : (ingredientsSk[index] ?? label);
  });
}
