import type { Locale } from '../i18n/types';

export interface LegalListItem {
  term?: string;
  text: string;
}

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'ul' | 'ol'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] };

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  items?: LegalListItem[];
  /** Rendered in order, for sections that mix text, lists and tables. */
  blocks?: LegalBlock[];
}

export interface LegalDocument {
  intro?: string;
  sections: LegalSection[];
}

export type LegalContent = Record<Locale, LegalDocument>;
