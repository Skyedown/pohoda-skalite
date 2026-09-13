import type { Locale } from '../i18n/types';

export interface LegalListItem {
  term?: string;
  text: string;
}

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  items?: LegalListItem[];
}

export interface LegalDocument {
  intro?: string;
  sections: LegalSection[];
}

export type LegalContent = Record<Locale, LegalDocument>;
