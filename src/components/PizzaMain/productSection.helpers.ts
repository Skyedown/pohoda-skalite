import type { TranslationKey } from '../../i18n/sk';
import type { ProductBadge } from '../../types';

type Translate = (key: TranslationKey) => string;

const BADGE_KEYS: Record<ProductBadge, TranslationKey> = {
  classic: 'common_badge_our_choice',
  premium: 'common_badge_our_choice',
  special: 'common_badge_bestseller',
};

export function getBadgeLabel(
  badge: ProductBadge | undefined,
  t: Translate,
): string {
  return badge ? t(BADGE_KEYS[badge]) : '';
}
