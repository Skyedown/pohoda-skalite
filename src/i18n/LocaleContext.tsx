import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { sk, type TranslationKey } from './sk';
import { pl } from './pl';
import { detectLocale } from './resolveLocale';
import { formatPrice, interpolate, pickPrice, pickText } from './format';
import {
  CURRENCY_BY_LOCALE,
  HTML_LANG,
  type Currency,
  type Locale,
  type LocalizedPrice,
  type LocalizedText,
} from './types';

const DICTIONARIES = { sk, pl } as const;

export interface LocaleContextValue {
  locale: Locale;
  currency: Currency;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  price: (amount: number) => string;
  text: (value: LocalizedText) => string;
  amount: (value: LocalizedPrice) => number;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
  locale?: Locale;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({
  children,
  locale: forcedLocale,
}) => {
  const locale = forcedLocale ?? detectLocale();

  const value = useMemo<LocaleContextValue>(() => {
    const dictionary = DICTIONARIES[locale];
    const currency = CURRENCY_BY_LOCALE[locale];

    return {
      locale,
      currency,
      t: (key, vars) => interpolate(dictionary[key], vars),
      price: (amount) => formatPrice(amount, currency),
      text: (value) => pickText(value, locale),
      amount: (value) => pickPrice(value, locale),
    };
  }, [locale]);

  if (typeof document !== 'undefined') {
    document.documentElement.lang = HTML_LANG[locale];
  }

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLocale = (): LocaleContextValue => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
