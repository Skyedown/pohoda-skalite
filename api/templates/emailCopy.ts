import type { Tenant } from '../utils/tenant.js';

export interface CustomerEmailCopy {
  subject: string;
  heading: string;
  thanks: string;
  confirmationTitle: string;
  confirmationBody: string;
  itemsHeading: string;
  columnItem: string;
  columnCount: string;
  columnPrice: string;
  without: string;
  subtotal: string;
  delivery: string;
  total: string;
  addressHeadingPickup: string;
  addressHeadingDelivery: string;
  name: string;
  address: string;
  note: string;
  paymentLabel: string;
  paymentCash: string;
  paymentCard: string;
  questions: string;
  footerAddress: string;
  terms: string;
  termsUrl: string;
  privacy: string;
  privacyUrl: string;
}

const SK: CustomerEmailCopy = {
  subject: 'Potvrdenie objednávky - Pizza Pohoda',
  heading: 'Pizza Pohoda',
  thanks: 'Ďakujeme za vašu objednávku!',
  confirmationTitle: 'Potvrdenie objednávky',
  confirmationBody:
    'Vaša objednávka bola úspešne prijatá a je v príprave. Tešíme sa, že vás čoskoro obslúžime!',
  itemsHeading: 'Objednané položky:',
  columnItem: 'Položka',
  columnCount: 'Počet',
  columnPrice: 'Cena',
  without: 'Bez',
  subtotal: 'Medzisúčet:',
  delivery: 'Doprava:',
  total: 'Celkom:',
  addressHeadingPickup: 'Vyzdvihnutie v reštaurácii',
  addressHeadingDelivery: 'Adresa doručenia',
  name: 'Meno:',
  address: 'Adresa:',
  note: 'Poznámka:',
  paymentLabel: 'Spôsob platby:',
  paymentCash: 'V hotovosti',
  paymentCard: 'Kartou',
  questions: 'Máte otázky?',
  footerAddress: 'Skalité 1386, 023 14 Skalité, Kysuce',
  terms: 'Obchodné podmienky',
  termsUrl: 'https://pizzapohoda.sk/obchodne-podmienky',
  privacy: 'Ochrana osobných údajov',
  privacyUrl: 'https://pizzapohoda.sk/ochrana-osobnych-udajov',
};

const PL: CustomerEmailCopy = {
  subject: 'Potwierdzenie zamówienia - Pizza Pohoda',
  heading: 'Pizza Pohoda',
  thanks: 'Dziękujemy za Twoje zamówienie!',
  confirmationTitle: 'Potwierdzenie zamówienia',
  confirmationBody:
    'Twoje zamówienie zostało przyjęte i jest przygotowywane. Cieszymy się, że wkrótce Cię obsłużymy!',
  itemsHeading: 'Zamówione pozycje:',
  columnItem: 'Pozycja',
  columnCount: 'Ilość',
  columnPrice: 'Cena',
  without: 'Bez',
  subtotal: 'Suma częściowa:',
  delivery: 'Dostawa:',
  total: 'Razem:',
  addressHeadingPickup: 'Odbiór osobisty w lokalu',
  addressHeadingDelivery: 'Adres dostawy',
  name: 'Imię i nazwisko:',
  address: 'Adres:',
  note: 'Uwagi:',
  paymentLabel: 'Sposób płatności:',
  paymentCash: 'Gotówką',
  paymentCard: 'Kartą',
  questions: 'Masz pytania?',
  footerAddress: 'Skalité 1386, 023 14 Skalité, Słowacja',
  terms: 'Regulamin',
  termsUrl: 'https://pizzapohoda.pl/regulamin',
  privacy: 'Polityka prywatności',
  privacyUrl: 'https://pizzapohoda.pl/polityka-prywatnosci',
};

export const CUSTOMER_EMAIL_COPY: Record<Tenant, CustomerEmailCopy> = {
  sk: SK,
  pl: PL,
};
