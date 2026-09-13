import { COMPANY, formatPhone } from '../constants/company';
import type { LegalDocument, LegalSection } from './types';

function tokens(): Record<string, string> {
  return {
    legalName: COMPANY.legalName,
    address: `${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city}`,
    email: COMPANY.email,
    phone: formatPhone(COMPANY.phone),
    ico: COMPANY.registrationNumber || '—',
    dic: COMPANY.taxNumber || '—',
    icDph: COMPANY.vatNumber || '—',
  };
}

function fill(text: string, values: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? values[key] : match,
  );
}

/** Company identifiers live in one place, so legal copy never hardcodes them. */
export function resolveLegalDocument(document: LegalDocument): LegalDocument {
  const values = tokens();

  const sections: LegalSection[] = document.sections.map((section) => ({
    title: fill(section.title, values),
    paragraphs: section.paragraphs?.map((p) => fill(p, values)),
    items: section.items?.map((item) => ({
      term: item.term ? fill(item.term, values) : undefined,
      text: fill(item.text, values),
    })),
  }));

  return {
    intro: document.intro ? fill(document.intro, values) : undefined,
    sections,
  };
}
