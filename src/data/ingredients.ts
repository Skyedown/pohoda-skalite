import type { LocalizedText } from '../i18n/types';

/** Shared so the same ingredient always reads identically across the menu. */
export const ING = {
  tomatoSauce: { sk: 'paradajková omáčka', pl: 'sos pomidorowy' },
  mozzarella: { sk: 'mozzarella', pl: 'mozzarella' },
  basil: { sk: 'bazalka', pl: 'bazylia' },
  oliveOil: { sk: 'olivový olej', pl: 'oliwa z oliwek' },
  prosciutto: {
    sk: 'prosciutto crudo/schwartzwaldská šunka',
    pl: 'prosciutto crudo / szynka szwarcwaldzka',
  },
  rucola: { sk: 'rukola', pl: 'rukola' },
  parmigiano: { sk: 'parmigiano', pl: 'parmigiano' },
  blackOlives: { sk: 'čierne olivy', pl: 'czarne oliwki' },
  ham: { sk: 'šunka', pl: 'szynka' },
  mushrooms: { sk: 'šampiňóny', pl: 'pieczarki' },
  gorgonzola: { sk: 'gorgonzola', pl: 'gorgonzola' },
  smokedCheese: { sk: 'údený syr', pl: 'ser wędzony' },
  spicySalami: { sk: 'pikantná saláma', pl: 'pikantne salami' },
  bacon: { sk: 'slanina', pl: 'boczek' },
  piriPiri: {
    sk: 'chilli papričky piri-piri',
    pl: 'papryczki chilli piri-piri',
  },
  redOnion: { sk: 'červená cibuľka', pl: 'czerwona cebula' },
  pineapple: { sk: 'ananás', pl: 'ananas' },
  bryndzaBase: {
    sk: 'smotanovo bryndzový základ',
    pl: 'baza śmietanowo-bryndzowa',
  },
  cracklings: { sk: 'oškvarky', pl: 'skwarki' },
  caramelizedOnion: {
    sk: 'karamelizovaná cibuľka',
    pl: 'karmelizowana cebula',
  },
  springOnionSeasonal: {
    sk: 'jarná cibuľka/pažítka(sezónne)',
    pl: 'dymka / szczypiorek (sezonowo)',
  },
  chivesSeasonal: {
    sk: 'pažítka alebo jarná cibuľka (sezónne)',
    pl: 'szczypiorek lub dymka (sezonowo)',
  },
  grillingCheese: { sk: 'encián', pl: 'ser grillowany camembert' },
  cherryTomatoes: { sk: 'cherry paradajky', pl: 'pomidorki cherry' },
  babySpinach: { sk: 'baby špenát', pl: 'baby szpinak' },
  onion: { sk: 'cibuľka', pl: 'cebula' },
  jalapeno: { sk: 'jallapeňo', pl: 'jalapeño' },
  sausage: { sk: 'klobása', pl: 'kiełbasa' },
  salami: { sk: 'saláma', pl: 'salami' },
  corn: { sk: 'kukurica', pl: 'kukurydza' },

  // Burgers
  homemadeBun: { sk: 'domáca žemľa', pl: 'domowa bułka' },
  beef160: { sk: 'hovädzie mäso (160g)', pl: 'wołowina (160 g)' },
  beef2x80: { sk: '2x hovädzie mäso (80g)', pl: '2× wołowina (80 g)' },
  cheddar: { sk: 'cheddar', pl: 'cheddar' },
  cheddar2x: { sk: '2x cheddar', pl: '2× cheddar' },
  lettuce: { sk: 'šalát', pl: 'sałata' },
  tomato: { sk: 'paradajka', pl: 'pomidor' },
  pickle: { sk: 'kyslá uhorka', pl: 'ogórek kiszony' },
  cheeseHoneyMustard: {
    sk: 'syrová a medová horčica',
    pl: 'sos serowy i musztarda miodowa',
  },
  baconSauce: { sk: 'slaninová omáčka', pl: 'sos boczkowy' },
  hannibalSauce: { sk: 'hannibal omáčka', pl: 'sos hannibal' },
  samuraiSauce: { sk: 'samuraj omáčka', pl: 'sos samuraj' },
  grilledEncian110: {
    sk: 'grilovaný encián (110g)',
    pl: 'grillowany ser camembert (110 g)',
  },
  cranberrySauce: { sk: 'brusnicová omáčka', pl: 'sos żurawinowy' },
  friedEgg: { sk: 'volské oko', pl: 'jajko sadzone' },

  // Langoš
  garlic: { sk: 'cesnak', pl: 'czosnek' },
  sourCream: { sk: 'kyslá smotana', pl: 'śmietana' },
  cheese: { sk: 'syr', pl: 'ser' },
  ketchup: { sk: 'kečup', pl: 'ketchup' },
  tartarSauce: { sk: 'tatarská omáčka', pl: 'sos tatarski' },
  nutella: { sk: 'nutella', pl: 'Nutella' },
  banana: { sk: 'banán', pl: 'banan' },
  icingSugar: { sk: 'práškový cukor', pl: 'cukier puder' },

  // Sides
  potatoes: { sk: 'zemiaky', pl: 'ziemniaki' },
  salt: { sk: 'soľ', pl: 'sól' },
} as const satisfies Record<string, LocalizedText>;
