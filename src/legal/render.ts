import { COMPANY, formatPhone } from '../constants/company';
import type { LegalBlock, LegalDocument, LegalSection } from './types';

function tokens(): Record<string, string> {
  return {
    legalName: COMPANY.legalName,
    address: `${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city}`,
    street: COMPANY.street,
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

function fillBlock(
  block: LegalBlock,
  values: Record<string, string>,
): LegalBlock {
  switch (block.type) {
    case 'p':
      return { ...block, text: fill(block.text, values) };
    case 'ul':
    case 'ol':
      return { ...block, items: block.items.map((i) => fill(i, values)) };
    case 'table':
      return {
        ...block,
        rows: block.rows.map((row) => row.map((cell) => fill(cell, values))),
      };
  }
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
    blocks: section.blocks?.map((block) => fillBlock(block, values)),
  }));

  return {
    intro: document.intro ? fill(document.intro, values) : undefined,
    sections,
  };
}
