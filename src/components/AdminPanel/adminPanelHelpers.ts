import type {
  AdminSettings,
  AnnouncementMode,
} from '../../utils/adminSettings';

export type ProductType = 'pizza' | 'burger' | 'langos' | 'sides';

export const PRODUCT_TYPES: ProductType[] = [
  'pizza',
  'burger',
  'langos',
  'sides',
];

export const PRODUCT_LABELS: Record<ProductType, string> = {
  pizza: 'Pizze',
  burger: 'Burgre',
  langos: 'Langoše',
  sides: 'Prílohy',
};

export const MODES: {
  value: AnnouncementMode;
  label: string;
  description: string;
}[] = [
  {
    value: 'off',
    label: 'Bez obmedzení',
    description: 'Žiadne oznámenie, objednávky fungují normálne',
  },
  {
    value: 'waitTime',
    label: 'Čakacia doba',
    description: 'Informuje zákazníkov o dlhšej čakacej dobe',
  },
  {
    value: 'disabled',
    label: 'Pozastavené',
    description: 'Objednávky sú úplne pozastavené',
  },
  {
    value: 'customNote',
    label: 'Vlastná poznámka',
    description: 'Zobraziť vlastné oznámenie',
  },
];

export const DEFAULT_SETTINGS: AdminSettings = {
  mode: 'off',
  waitTimeMinutes: 60,
  customNote:
    'Z dôvodu nepriaznivého počasia je donáška možná len k hlavnej ceste',
  disabledReason:
    'Z dôvodu veľkého počtu objednávok sme momentálne nútení pozastaviť prijímanie nových online objednávok. Ďakujeme za pochopenie a ospravedlňujeme sa za nepríjemnosti. Skúste to prosím neskôr alebo nás kontaktujte telefonicky.',
  disabledProductTypes: [],
  cardPaymentDeliveryEnabled: false,
  cardPaymentPickupEnabled: false,
};
