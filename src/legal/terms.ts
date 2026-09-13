import type { LegalContent } from './types';

export const TERMS_CONTENT: LegalContent = {
  sk: {
    intro:
      'Tieto všeobecné obchodné podmienky upravujú objednávanie jedál a nápojov cez webovú stránku pizzapohoda.sk.',
    sections: [
      {
        title: '1. Predávajúci',
        items: [
          { term: 'Obchodné meno:', text: '{legalName}' },
          {
            term: 'Miesto podnikania:',
            text: '{address}, Slovenská republika',
          },
          { term: 'IČO:', text: '{ico}' },
          { term: 'DIČ:', text: '{dic}' },
          { term: 'IČ DPH:', text: '{icDph}' },
          { term: 'E-mail:', text: '{email}' },
          { term: 'Telefón:', text: '{phone}' },
        ],
      },
      {
        title: '2. Predmet a rozsah služby',
        paragraphs: [
          'Predávajúci pripravuje a predáva jedlá a nápoje. Objednávku je možné vyzdvihnúť osobne v prevádzke alebo si ju nechať doručiť do obcí uvedených v sekcii Donáška na hlavnej stránke.',
          'Ponuka jedál, ich zloženie, hmotnosť, alergény a ceny sú uvedené pri každej položke v menu.',
        ],
      },
      {
        title: '3. Objednávka a uzavretie zmluvy',
        paragraphs: [
          'Zákazník vloží zvolené položky do košíka, vyplní kontaktné a doručovacie údaje a objednávku odošle tlačidlom „Potvrdiť objednávku“. Odoslanie objednávky je návrhom na uzavretie zmluvy a je spojené s povinnosťou platby.',
          'Zmluva je uzavretá okamihom, keď predávajúci potvrdí prijatie objednávky e-mailom na adresu uvedenú zákazníkom.',
          'Predávajúci si vyhradzuje právo objednávku neprijať, ak je prevádzka vyťažená, mimo otváracích hodín alebo ak je adresa doručenia mimo rozvozovej oblasti. O takomto prípade zákazníka bezodkladne informuje.',
        ],
      },
      {
        title: '4. Ceny a platba',
        paragraphs: [
          'Všetky ceny sú uvedené v eurách vrátane DPH. Konečná cena vrátane prípadného poplatku za dopravu je zákazníkovi zobrazená v súhrne objednávky pred jej odoslaním.',
          'Platba prebieha pri prevzatí objednávky v hotovosti, prípadne platobnou kartou, ak je táto možnosť v danom čase aktívna.',
        ],
      },
      {
        title: '5. Donáška',
        paragraphs: [
          'Donáška je poskytovaná do obcí uvedených na webovej stránke. Pre každú obec platí minimálna hodnota objednávky, ktorá je zobrazená v košíku; objednávku pod touto hodnotou nie je možné odoslať.',
          'Uvádzané časy prípravy a doručenia sú orientačné a môžu sa predĺžiť pri zvýšenom počte objednávok alebo nepriaznivom počasí.',
        ],
      },
      {
        title: '6. Odstúpenie od zmluvy',
        paragraphs: [
          'V súlade s § 7 ods. 6 zákona č. 102/2014 Z. z. zákazník nemôže odstúpiť od zmluvy, ktorej predmetom je predaj tovaru podliehajúceho rýchlemu zníženiu akosti alebo skaze, ani od zmluvy o poskytnutí stravovacích služieb v dohodnutom čase. Pripravené jedlá a nápoje preto nie je možné vrátiť.',
          'Objednávku je možné zrušiť telefonicky na čísle {phone}, pokiaľ jej príprava ešte nezačala.',
        ],
      },
      {
        title: '7. Reklamácie',
        paragraphs: [
          'Ak objednávka nezodpovedá objednanému obsahu alebo má vadu, kontaktujte nás bezodkladne, najneskôr do 24 hodín od prevzatia, telefonicky na {phone} alebo e-mailom na {email}.',
          'Reklamáciu vybavíme najneskôr do 30 dní od jej uplatnenia. O spôsobe vybavenia Vás budeme informovať e-mailom alebo telefonicky.',
        ],
      },
      {
        title: '8. Alergény',
        paragraphs: [
          'Pri každej položke menu sú uvedené čísla alergénov podľa prílohy č. 1 k výnosu Ministerstva pôdohospodárstva SR. Ak máte potravinovú alergiu, kontaktujte nás pred objednávkou telefonicky.',
        ],
      },
      {
        title: '9. Ochrana osobných údajov',
        paragraphs: [
          'Spracúvanie osobných údajov je popísané v samostatnom dokumente Ochrana osobných údajov, ktorý je dostupný v pätičke webovej stránky.',
        ],
      },
      {
        title: '10. Riešenie sporov',
        paragraphs: [
          'Prípadné spory sa snažíme riešiť dohodou. Zákazník má právo obrátiť sa na subjekt alternatívneho riešenia sporov — Slovenská obchodná inšpekcia, Bajkalská 21/A, 827 99 Bratislava — alebo využiť európsku platformu na riešenie sporov online.',
        ],
      },
      {
        title: '11. Záverečné ustanovenia',
        paragraphs: [
          'Vzťahy neupravené týmito podmienkami sa riadia právnym poriadkom Slovenskej republiky. Predávajúci si vyhradzuje právo tieto podmienky meniť; pre objednávku platí znenie účinné v čase jej odoslania.',
        ],
      },
    ],
  },
  pl: {
    intro:
      'Niniejszy regulamin określa zasady zamawiania posiłków i napojów za pośrednictwem strony internetowej pizzapohoda.pl.',
    sections: [
      {
        title: '1. Sprzedawca',
        items: [
          { term: 'Nazwa:', text: '{legalName}' },
          { term: 'Adres:', text: '{address}, Słowacja' },
          { term: 'Numer identyfikacyjny (IČO):', text: '{ico}' },
          { term: 'Numer podatkowy (DIČ):', text: '{dic}' },
          { term: 'Numer VAT (IČ DPH):', text: '{icDph}' },
          { term: 'E-mail:', text: '{email}' },
          { term: 'Telefon:', text: '{phone}' },
        ],
        paragraphs: [
          'Sprzedawca jest przedsiębiorcą zarejestrowanym na Słowacji i prowadzi sprzedaż transgraniczną do Polski. Konsumentom mającym miejsce zwykłego pobytu w Polsce przysługuje ochrona wynikająca z bezwzględnie obowiązujących przepisów prawa polskiego.',
        ],
      },
      {
        title: '2. Przedmiot i zakres usługi',
        paragraphs: [
          'Sprzedawca przygotowuje i sprzedaje posiłki oraz napoje. Zamówienie można odebrać osobiście w lokalu albo zamówić z dowozem do miejscowości wskazanych w sekcji Dostawa na stronie głównej.',
          'Skład potraw, gramatura, alergeny i ceny są podane przy każdej pozycji w menu.',
        ],
      },
      {
        title: '3. Składanie zamówienia i zawarcie umowy',
        paragraphs: [
          'Klient dodaje wybrane pozycje do koszyka, uzupełnia dane kontaktowe i adresowe, a następnie składa zamówienie przyciskiem „Potwierdź zamówienie”. Złożenie zamówienia wiąże się z obowiązkiem zapłaty.',
          'Umowa zostaje zawarta z chwilą potwierdzenia przyjęcia zamówienia przez sprzedawcę na adres e-mail podany przez klienta.',
          'Sprzedawca może odmówić przyjęcia zamówienia, jeżeli lokal jest przeciążony, zamówienie zostało złożone poza godzinami otwarcia albo adres dostawy znajduje się poza obszarem dowozu. Klient zostanie o tym niezwłocznie poinformowany.',
        ],
      },
      {
        title: '4. Ceny i płatność',
        paragraphs: [
          'Wszystkie ceny podane są w złotych polskich i zawierają podatek. Cena końcowa wraz z ewentualnym kosztem dostawy jest widoczna w podsumowaniu zamówienia przed jego złożeniem.',
          'Płatność następuje przy odbiorze zamówienia gotówką, a także kartą płatniczą, jeżeli ta opcja jest w danym momencie aktywna.',
        ],
      },
      {
        title: '5. Dostawa',
        paragraphs: [
          'Dostawa realizowana jest do miejscowości wskazanych na stronie internetowej. Dla każdej miejscowości obowiązuje minimalna wartość zamówienia widoczna w koszyku; zamówienia poniżej tej kwoty nie można złożyć.',
          'Podawane czasy przygotowania i dostawy mają charakter orientacyjny i mogą ulec wydłużeniu przy zwiększonej liczbie zamówień lub niekorzystnych warunkach pogodowych.',
        ],
      },
      {
        title: '6. Prawo odstąpienia od umowy',
        paragraphs: [
          'Zgodnie z art. 38 pkt 4 oraz pkt 12 ustawy z dnia 30 maja 2014 r. o prawach konsumenta prawo odstąpienia od umowy zawartej na odległość nie przysługuje konsumentowi w odniesieniu do umów, w których przedmiotem świadczenia jest rzecz ulegająca szybkiemu zepsuciu lub mająca krótki termin przydatności do spożycia, a także w odniesieniu do umów o świadczenie usług gastronomicznych, jeżeli w umowie oznaczono dzień lub okres świadczenia usługi.',
          'Przygotowanych posiłków i napojów nie można zatem zwrócić ani odstąpić od umowy po jej zawarciu.',
          'Zamówienie można anulować telefonicznie pod numerem {phone}, o ile jego przygotowanie jeszcze się nie rozpoczęło.',
        ],
      },
      {
        title: '7. Reklamacje',
        paragraphs: [
          'Jeżeli zamówienie nie odpowiada zamówionej treści albo ma wadę, prosimy o niezwłoczny kontakt, najpóźniej w ciągu 24 godzin od odbioru — telefonicznie pod numerem {phone} lub e-mailem na adres {email}.',
          'Reklamacja powinna zawierać imię i nazwisko, datę i godzinę zamówienia oraz opis nieprawidłowości. Reklamację rozpatrzymy w terminie 14 dni od jej otrzymania i poinformujemy o sposobie jej rozpatrzenia e-mailem lub telefonicznie.',
          'Sprzedawca odpowiada wobec konsumenta za brak zgodności towaru z umową na zasadach określonych w ustawie o prawach konsumenta.',
        ],
      },
      {
        title: '8. Alergeny',
        paragraphs: [
          'Przy każdej pozycji menu podane są numery alergenów zgodnie z rozporządzeniem Parlamentu Europejskiego i Rady (UE) nr 1169/2011 w sprawie przekazywania konsumentom informacji na temat żywności. W przypadku alergii pokarmowej prosimy o kontakt telefoniczny przed złożeniem zamówienia.',
        ],
      },
      {
        title: '9. Ochrona danych osobowych',
        paragraphs: [
          'Zasady przetwarzania danych osobowych opisane są w odrębnym dokumencie Polityka prywatności, dostępnym w stopce strony internetowej.',
        ],
      },
      {
        title: '10. Pozasądowe rozwiązywanie sporów',
        paragraphs: [
          'Dążymy do polubownego rozwiązywania sporów. Konsument może skorzystać z pomocy miejskiego lub powiatowego rzecznika konsumentów, wojewódzkiego inspektoratu Inspekcji Handlowej, a także z europejskiej platformy internetowego rozstrzygania sporów (ODR) dostępnej pod adresem ec.europa.eu/consumers/odr.',
          'Konsument może również zwrócić się do Europejskiego Centrum Konsumenckiego w Polsce, które zajmuje się sporami transgranicznymi na terenie Unii Europejskiej.',
        ],
      },
      {
        title: '11. Postanowienia końcowe',
        paragraphs: [
          'W sprawach nieuregulowanych niniejszym regulaminem zastosowanie ma prawo słowackie, z zastrzeżeniem że wybór prawa nie pozbawia konsumenta ochrony wynikającej z bezwzględnie obowiązujących przepisów prawa polskiego.',
          'Sprzedawca zastrzega sobie prawo do zmiany regulaminu. Dla danego zamówienia obowiązuje wersja regulaminu obowiązująca w chwili jego złożenia.',
        ],
      },
    ],
  },
};
