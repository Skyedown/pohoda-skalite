import type { Locale } from '../i18n/types';
import type { TranslationKey } from '../i18n/sk';
import type { ProductType } from '../types';
import type { AdminSettings } from './adminSettings';
import { config } from '../config';
import { formatWaitTime } from './waitTime';

export type OrderingStatus =
  | 'before_preorder'
  | 'preorder'
  | 'open'
  | 'orders_closed'
  | 'closed'
  | 'admin_disabled'
  | 'admin_wait_time';

export interface OrderingStatusInfo {
  status: OrderingStatus;
  canOrder: boolean;
  message: string;
  disabledProductTypes: ProductType[];
}

type Translate = (
  key: TranslationKey,
  vars?: Record<string, string | number>,
) => string;

const TYPE_KEYS: Record<ProductType, TranslationKey> = {
  pizza: 'type_pizza',
  burger: 'type_burger',
  langos: 'type_langos',
  sides: 'type_sides',
  capovane: 'type_capovane',
  drinks: 'type_drinks',
  snacks: 'type_snacks',
};

function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function currentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function joinDisabledLabels(types: ProductType[], t: Translate): string {
  const names = types.map((type) => t(TYPE_KEYS[type]));
  if (names.length <= 1) return names[0] ?? '';
  if (names.length === 2)
    return `${names[0]} ${t('status_list_and')} ${names[1]}`;
  return `${names.slice(0, -1).join(', ')} ${t('status_list_and')} ${names[names.length - 1]}`;
}

export function getTimeBasedStatus(t: Translate): OrderingStatusInfo {
  const { preorderStartTime, openingTime, lastOrderTime, closingTime } = config;

  const now = currentMinutes();

  if (now < timeToMinutes(preorderStartTime)) {
    return {
      status: 'before_preorder',
      canOrder: false,
      message: t('status_before_preorder', { time: preorderStartTime }),
      disabledProductTypes: [],
    };
  }

  if (now < timeToMinutes(openingTime)) {
    return {
      status: 'preorder',
      canOrder: true,
      message: t('status_preorder', { time: openingTime }),
      disabledProductTypes: [],
    };
  }

  if (now < timeToMinutes(lastOrderTime)) {
    return {
      status: 'open',
      canOrder: true,
      message: '',
      disabledProductTypes: [],
    };
  }

  if (now < timeToMinutes(closingTime)) {
    return {
      status: 'orders_closed',
      canOrder: false,
      message: t('status_orders_closed'),
      disabledProductTypes: [],
    };
  }

  return {
    status: 'closed',
    canOrder: false,
    message: t('status_closed', { time: preorderStartTime }),
    disabledProductTypes: [],
  };
}

export function resolveOrderingStatus(
  settings: AdminSettings,
  locale: Locale,
  t: Translate,
): OrderingStatusInfo {
  const disabledProductTypes = settings.disabledProductTypes ?? [];
  const soldOut = disabledProductTypes.length
    ? joinDisabledLabels(disabledProductTypes, t)
    : '';

  if (settings.mode === 'disabled') {
    return {
      status: 'admin_disabled',
      canOrder: false,
      message: t('status_admin_disabled'),
      disabledProductTypes,
    };
  }

  if (settings.mode === 'waitTime') {
    let message = t('status_wait_time', {
      waitTime: formatWaitTime(settings.waitTimeMinutes, locale, t),
    });
    if (soldOut) {
      message += `. ${t('status_sold_out_sentence', { products: soldOut })}`;
    }
    return {
      status: 'admin_wait_time',
      canOrder: true,
      message,
      disabledProductTypes,
    };
  }

  if (settings.mode === 'customNote') {
    let message = settings.customNote[locale];
    if (soldOut) {
      message += ` ${t('status_sold_out_parenthetical', { products: soldOut })}`;
    }
    return {
      status: 'admin_wait_time',
      canOrder: true,
      message,
      disabledProductTypes,
    };
  }

  const timeBased = getTimeBasedStatus(t);
  let message = timeBased.message;
  if (soldOut) {
    const sentence = t('status_sold_out_sentence', { products: soldOut });
    message = message ? `${message} ${sentence}` : sentence;
  }

  return { ...timeBased, message, disabledProductTypes };
}
