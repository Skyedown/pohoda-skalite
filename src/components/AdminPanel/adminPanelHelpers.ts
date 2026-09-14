import type { AnnouncementMode } from '../../utils/adminSettings';

export { DEFAULT_SETTINGS } from '../../utils/adminSettings';

export type ProductType =
  | 'pizza'
  | 'burger'
  | 'langos'
  | 'sides'
  | 'capovane'
  | 'drinks'
  | 'snacks';

export const PRODUCT_TYPES: ProductType[] = [
  'pizza',
  'burger',
  'langos',
  'sides',
  'capovane',
  'drinks',
  'snacks',
];

export const PRODUCT_LABELS: Record<ProductType, string> = {
  pizza: 'Pizze',
  burger: 'Burgre',
  langos: 'Langoše',
  sides: 'Prílohy',
  capovane: 'Čapované',
  drinks: 'Nápoje',
  snacks: 'Snacky',
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
