import { sk, type TranslationKey } from './sk';
import { interpolate } from './format';

/**
 * The admin is Slovak-only regardless of which storefront an order came from,
 * so it translates against the Slovak dictionary directly.
 */
export function tSk(
  key: TranslationKey,
  vars?: Record<string, string | number>,
): string {
  return interpolate(sk[key], vars);
}
