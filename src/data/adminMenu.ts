import { localizeProducts } from './localize';
import { pizzas } from './pizzas';
import { burgers } from './burgers';
import { langos } from './langos';
import { prilohy } from './prilohy';
import { capovane } from './capovane';
import { drinks } from './drinks';
import { snacks } from './snacks';
import type { LocalizedProduct, ProductType } from '../types';

/** The admin always works in Slovak, so the menu is resolved once at module load. */
export const ADMIN_PRODUCTS_BY_CATEGORY: Record<
  ProductType,
  LocalizedProduct[]
> = {
  pizza: localizeProducts(pizzas, 'sk'),
  burger: localizeProducts(burgers, 'sk'),
  langos: localizeProducts(langos, 'sk'),
  sides: localizeProducts(prilohy, 'sk'),
  capovane: localizeProducts(capovane, 'sk'),
  drinks: localizeProducts(drinks, 'sk'),
  snacks: localizeProducts(snacks, 'sk'),
};

export const ADMIN_PRODUCTS: LocalizedProduct[] = Object.values(
  ADMIN_PRODUCTS_BY_CATEGORY,
).flat();
