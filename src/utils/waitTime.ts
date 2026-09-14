import { pluralCategory } from '../i18n/format';
import type { Locale } from '../i18n/types';
import type { TranslationKey } from '../i18n/sk';

type Translate = (
  key: TranslationKey,
  vars?: Record<string, string | number>,
) => string;

const HOUR_KEYS = {
  one: 'wait_hours_one',
  few: 'wait_hours_few',
  many: 'wait_hours_many',
} as const satisfies Record<string, TranslationKey>;

const MINUTE_KEYS = {
  one: 'wait_minutes_one',
  few: 'wait_minutes_few',
  many: 'wait_minutes_many',
} as const satisfies Record<string, TranslationKey>;

export function formatWaitTime(
  minutes: number,
  locale: Locale,
  t: Translate,
): string {
  if (minutes >= 181) {
    return t('wait_three_plus_hours');
  }

  if (minutes < 60) {
    return `${minutes} ${t(MINUTE_KEYS[pluralCategory(minutes, locale)])}`;
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const hoursLabel = `${hours} ${t(HOUR_KEYS[pluralCategory(hours, locale)])}`;

  if (rest === 0) return hoursLabel;

  return `${hoursLabel} ${rest} ${t(MINUTE_KEYS[pluralCategory(rest, locale)])}`;
}
