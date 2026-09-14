import { useMemo } from 'react';
import { useLocale } from '../i18n/LocaleContext';
import { localizeExtras, localizeProducts } from '../data/localize';
import { pizzas } from '../data/pizzas';
import { burgers } from '../data/burgers';
import { langos } from '../data/langos';
import { prilohy } from '../data/prilohy';
import { capovane } from '../data/capovane';
import { drinks } from '../data/drinks';
import { snacks } from '../data/snacks';
import type {
  Extra,
  LocalizedExtra,
  LocalizedProduct,
  Product,
} from '../types';

export function useLocalizedProducts(products: Product[]): LocalizedProduct[] {
  const { locale } = useLocale();
  return useMemo(() => localizeProducts(products, locale), [products, locale]);
}

export function useLocalizedExtras(extras: Extra[]): LocalizedExtra[] {
  const { locale } = useLocale();
  return useMemo(() => localizeExtras(extras, locale), [extras, locale]);
}

export function usePizzas(): LocalizedProduct[] {
  return useLocalizedProducts(pizzas);
}

export function useBurgers(): LocalizedProduct[] {
  return useLocalizedProducts(burgers);
}

export function useLangos(): LocalizedProduct[] {
  return useLocalizedProducts(langos);
}

export function usePrilohy(): LocalizedProduct[] {
  return useLocalizedProducts(prilohy);
}

export function useCapovane(): LocalizedProduct[] {
  return useLocalizedProducts(capovane);
}

export function useDrinks(): LocalizedProduct[] {
  return useLocalizedProducts(drinks);
}

export function useSnacks(): LocalizedProduct[] {
  return useLocalizedProducts(snacks);
}

/** Every menu item in one flat list — used by the admin availability screens. */
export const ALL_PRODUCTS: Product[] = [
  ...pizzas,
  ...burgers,
  ...langos,
  ...prilohy,
  ...capovane,
  ...drinks,
  ...snacks,
];
