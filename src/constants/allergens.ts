import type { TranslationKey } from '../i18n/sk';

type Translate = (
  key: TranslationKey,
  vars?: Record<string, string | number>,
) => string;

const ALLERGEN_KEYS: Record<string, TranslationKey> = {
  '1': 'allergen_1',
  '2': 'allergen_2',
  '3': 'allergen_3',
  '4': 'allergen_4',
  '5': 'allergen_5',
  '6': 'allergen_6',
  '7': 'allergen_7',
  '8': 'allergen_8',
  '9': 'allergen_9',
  '10': 'allergen_10',
  '11': 'allergen_11',
  '12': 'allergen_12',
  '13': 'allergen_13',
  '14': 'allergen_14',
};

export function getAllergenNames(
  allergenNumbers: string[],
  t: Translate,
): string[] {
  return allergenNumbers.map((num) => {
    const key = ALLERGEN_KEYS[num];
    return key ? t(key) : t('allergen_unknown', { number: num });
  });
}

export function formatAllergens(
  allergenNumbers: string[] | undefined,
  useNames: boolean,
  t: Translate,
): string {
  if (!allergenNumbers || allergenNumbers.length === 0) return '';
  if (useNames) return getAllergenNames(allergenNumbers, t).join(', ');
  return allergenNumbers.join(', ');
}
