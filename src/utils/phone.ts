import type { TranslationKey } from '../i18n/sk';

type Translate = (
  key: TranslationKey,
  vars?: Record<string, string | number>,
) => string;

interface NationalLength {
  min: number;
  max: number;
}

/** Digits expected after the country code. Unlisted codes fall back to E.164. */
const NATIONAL_LENGTHS: Record<string, NationalLength> = {
  '421': { min: 9, max: 9 },
  '420': { min: 9, max: 9 },
  '48': { min: 9, max: 9 },
  '36': { min: 8, max: 9 },
  '43': { min: 6, max: 13 },
  '49': { min: 6, max: 13 },
  '380': { min: 9, max: 9 },
  '44': { min: 9, max: 10 },
};

/** A Slovak number written domestically: 0 followed by nine digits. */
const TRUNK_LENGTH = 10;
/** A number typed without any prefix: Slovak without the 0, Czech or Polish. */
const BARE_LENGTH = 9;
/** Codes customers commonly type without the + (421 918 123 456). */
const BARE_CODES = ['421', '420', '48'];
const E164_MIN = 8;
const E164_MAX = 15;

const SEPARATORS = /[\s().\-/]/g;

export type PhoneIssue =
  | { kind: 'chars' }
  | { kind: 'plus' }
  | { kind: 'prefix'; prefix: string; expected: string; actual: number }
  | { kind: 'trunk'; actual: number }
  | { kind: 'length'; tooShort: boolean };

function findCountryCode(digits: string): string | null {
  return (
    Object.keys(NATIONAL_LENGTHS).find((code) => digits.startsWith(code)) ??
    null
  );
}

function checkInternational(digits: string): PhoneIssue | null {
  const code = findCountryCode(digits);

  if (!code) {
    if (digits.length < E164_MIN) return { kind: 'length', tooShort: true };
    if (digits.length > E164_MAX) return { kind: 'length', tooShort: false };
    return null;
  }

  // People often keep the domestic 0 after the prefix: +421 0918 123 456.
  const national = digits.slice(code.length).replace(/^0/, '');
  const { min, max } = NATIONAL_LENGTHS[code];
  if (national.length >= min && national.length <= max) return null;

  return {
    kind: 'prefix',
    prefix: `+${code}`,
    expected: min === max ? `${min}` : `${min}–${max}`,
    actual: national.length,
  };
}

function checkBare(digits: string): PhoneIssue | null {
  if (digits.length === BARE_LENGTH) return null;
  if (
    digits.length > BARE_LENGTH &&
    BARE_CODES.some((code) => digits.startsWith(code))
  ) {
    return checkInternational(digits);
  }
  return { kind: 'length', tooShort: digits.length < BARE_LENGTH };
}

export function checkPhone(raw: string): PhoneIssue | null {
  const compact = raw.replace(SEPARATORS, '');

  if (compact === '+') return { kind: 'length', tooShort: true };

  if (!/^\+?\d+$/.test(compact)) {
    return /^[\d+]+$/.test(compact) ? { kind: 'plus' } : { kind: 'chars' };
  }
  if (compact.startsWith('+')) return checkInternational(compact.slice(1));
  if (compact.startsWith('00')) return checkInternational(compact.slice(2));
  if (compact.startsWith('0')) {
    return compact.length === TRUNK_LENGTH
      ? null
      : { kind: 'trunk', actual: compact.length };
  }
  return checkBare(compact);
}

export function phoneIssueMessage(issue: PhoneIssue, t: Translate): string {
  switch (issue.kind) {
    case 'chars':
      return t('validation_phone_chars');
    case 'plus':
      return t('validation_phone_plus');
    case 'prefix':
      return t('validation_phone_prefix_length', {
        prefix: issue.prefix,
        expected: issue.expected,
        actual: issue.actual,
      });
    case 'trunk':
      return t('validation_phone_trunk_length', { actual: issue.actual });
    case 'length':
      return t(
        issue.tooShort
          ? 'validation_phone_too_short'
          : 'validation_phone_too_long',
      );
  }
}

/** The error to show for a phone field, or '' when the number is acceptable. */
export function phoneError(raw: string, t: Translate): string {
  if (!raw.trim()) return t('validation_phone_required');
  const issue = checkPhone(raw);
  return issue ? phoneIssueMessage(issue, t) : '';
}
