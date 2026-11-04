import type { LegalContent } from './types';

export const PRIVACY_CONTENT: LegalContent = {
  sk: {
    sections: [
      {
        title: '1. Úvod',
        paragraphs: [
          'Tieto zásady popisujú, ako spracúvame osobné údaje návštevníkov webovej stránky a zákazníkov pizzerie Pizza Pohoda. Ochrana Vašich osobných údajov je pre nás dôležitá a zaväzujeme sa s Vašimi údajmi zaobchádzať zodpovedne a v súlade s Nariadením Európskeho parlamentu a Rady (EÚ) 2016/679 (GDPR) a zákonom č. 18/2018 Z. z. o ochrane osobných údajov.',
        ],
      },
      {
        title: '2. Prevádzkovateľ',
        items: [
          { term: 'Obchodné meno:', text: '{legalName}' },
          { term: 'Sídlo:', text: '{address}, Slovenská republika' },
          { term: 'IČO:', text: '{ico}' },
          { term: 'DIČ:', text: '{dic}' },
          { term: 'E-mail:', text: '{email}' },
          { term: 'Telefón:', text: '{phone}' },
        ],
      },
      {
        title: '3. Aké osobné údaje spracúvame',
        paragraphs: [
          'Pri objednávke jedla prostredníctvom našej webovej stránky spracúvame nasledujúce osobné údaje:',
        ],
        items: [
          { term: 'Meno a priezvisko', text: '— pre identifikáciu objednávky' },
          { term: 'Adresa doručenia', text: '— obec a číslo domu' },
          {
            term: 'Telefónne číslo',
            text: '— pre kontaktovanie v súvislosti s objednávkou',
          },
          {
            term: 'E-mailová adresa',
            text: '— pre zaslanie potvrdenia objednávky',
          },
          {
            term: 'Informácie o objednávke',
            text: '— zoznam produktov, cena, čas objednávky, spôsob platby',
          },
          {
            term: 'Údaje o používaní webu',
            text: '— len s Vaším súhlasom: identifikátory cookies, IP adresa, údaje o zariadení a prehliadači, navštívené stránky a pri marketingových cookies aj hodnota objednávky',
          },
        ],
      },
      {
        title: '4. Účel a právny základ spracúvania',
        items: [
          {
            term: 'Vybavenie objednávky',
            text: '— plnenie zmluvy podľa čl. 6 ods. 1 písm. b) GDPR',
          },
          {
            term: 'Účtovníctvo a daňová evidencia',
            text: '— plnenie zákonnej povinnosti podľa čl. 6 ods. 1 písm. c) GDPR',
          },
          {
            term: 'Analytika návštevnosti (Google Analytics)',
            text: '— súhlas podľa čl. 6 ods. 1 písm. a) GDPR, ktorý môžete kedykoľvek odvolať',
          },
          {
            term: 'Meranie účinnosti reklamy (Meta Pixel)',
            text: '— súhlas podľa čl. 6 ods. 1 písm. a) GDPR, ktorý môžete kedykoľvek odvolať',
          },
          {
            term: 'Vybavovanie reklamácií a obrana právnych nárokov',
            text: '— oprávnený záujem podľa čl. 6 ods. 1 písm. f) GDPR',
          },
        ],
      },
      {
        title: '5. Doba uchovávania',
        items: [
          {
            term: 'Údaje o objednávke',
            text: '— 90 dní od vybavenia objednávky',
          },
          {
            term: 'Účtovné doklady',
            text: '— 10 rokov v súlade so zákonom o účtovníctve',
          },
          {
            term: 'Analytické údaje',
            text: '— maximálne 14 mesiacov alebo do odvolania súhlasu',
          },
          {
            term: 'Marketingové cookies',
            text: '— 90 dní alebo do odvolania súhlasu',
          },
          {
            term: 'Záznam o Vašej voľbe cookies',
            text: '— 12 mesiacov, potom Vás požiadame znova',
          },
        ],
        paragraphs: [
          'Po uplynutí doby uchovávania sú osobné údaje bezpečne vymazané alebo anonymizované.',
        ],
      },
      {
        title: '6. Príjemcovia osobných údajov',
        items: [
          {
            term: 'Poskytovatelia IT a hostingových služieb',
            text: '— prevádzka webovej stránky a databázy',
          },
          {
            term: 'SendGrid (Twilio Inc.)',
            text: '— odosielanie potvrdzovacích e-mailov',
          },
          {
            term: 'Google Ireland Ltd. (Google Analytics)',
            text: '— meranie návštevnosti, len pri udelenom súhlase',
          },
          {
            term: 'Meta Platforms Ireland Ltd. (Meta Pixel)',
            text: '— meranie účinnosti reklám na Facebooku a Instagrame, len pri udelenom súhlase. Pri zbere a odovzdaní údajov sme s Metou spoločnými prevádzkovateľmi podľa čl. 26 GDPR; ďalšie spracúvanie riadia zásady spoločnosti Meta.',
          },
          {
            term: 'Cloudflare, Inc.',
            text: '— doručovanie webu a ochrana pred útokmi',
          },
          {
            term: 'Účtovníci a daňoví poradcovia',
            text: '— vedenie účtovníctva',
          },
          { term: 'Štátne orgány', text: '— ak to vyžaduje zákon' },
        ],
        paragraphs: [
          'Časť našich dodávateľov môže osobné údaje spracúvať v Spojených štátoch amerických. Prenos sa uskutočňuje na základe rozhodnutia Európskej komisie o primeranosti (EU-US Data Privacy Framework) alebo štandardných zmluvných doložiek.',
        ],
      },
      {
        title: '7. Vaše práva',
        paragraphs: [
          'V súvislosti so spracúvaním osobných údajov máte právo na prístup k údajom, na ich opravu, na vymazanie, na obmedzenie spracúvania, na prenosnosť údajov, právo namietať proti spracúvaniu a právo kedykoľvek odvolať udelený súhlas.',
          'Máte tiež právo podať sťažnosť dozornému orgánu — Úrad na ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava, dozor@pdp.gov.sk.',
          'Svoje práva si môžete uplatniť na adrese {email}.',
        ],
      },
      {
        title: '8. Cookies',
        blocks: [
          {
            type: 'p',
            text: 'Nevyhnutné cookies a lokálne úložisko prehliadača používame bez súhlasu, pretože bez nich web nemôže fungovať (§ 109 ods. 8 zákona č. 452/2021 Z. z. o elektronických komunikáciách). Analytické a marketingové cookies nastavujeme a súvisiace skripty načítavame až po Vašom súhlase v cookie lište; dovtedy sa do Google ani do Mety nič neodosiela.',
          },
          {
            type: 'table',
            headers: ['Názov', 'Kategória', 'Účel', 'Platnosť', 'Poskytovateľ'],
            rows: [
              [
                'pohoda-cookie-consent (lokálne úložisko)',
                'Nevyhnutné',
                'Uloženie Vašej voľby cookies',
                '12 mesiacov',
                'Pizza Pohoda',
              ],
              [
                'pohoda-pizza-cart (lokálne úložisko)',
                'Nevyhnutné',
                'Obsah košíka',
                'Do vyprázdnenia košíka',
                'Pizza Pohoda',
              ],
              [
                'pohoda-locale-override (úložisko relácie)',
                'Nevyhnutné',
                'Ručne zvolený jazyk webu',
                'Do zatvorenia prehliadača',
                'Pizza Pohoda',
              ],
              [
                'pohoda_admin',
                'Nevyhnutné',
                'Prihlásenie obsluhy do administrácie',
                '24 hodín',
                'Pizza Pohoda',
              ],
              [
                '__cf_bm a podobné',
                'Nevyhnutné',
                'Ochrana webu pred robotmi a útokmi, ak ju Cloudflare použije',
                '30 minút',
                'Cloudflare, Inc.',
              ],
              [
                '_ga, _ga_*',
                'Analytické',
                'Rozlíšenie návštevníkov a relácií v Google Analytics',
                '2 roky',
                'Google Ireland Ltd.',
              ],
              [
                '_fbp, _fbc',
                'Marketingové',
                'Meranie účinnosti reklám na Facebooku a Instagrame',
                '90 dní',
                'Meta Platforms Ireland Ltd.',
              ],
            ],
          },
          {
            type: 'p',
            text: 'Súhlas môžete kedykoľvek zmeniť alebo odvolať cez odkaz „Nastavenia cookies“ v pätičke hlavnej stránky. Pri odvolaní cookies Google Analytics a Meta Pixel vymažeme. Odvolanie súhlasu nemá vplyv na zákonnosť spracúvania pred ním.',
          },
          {
            type: 'p',
            text: 'Odmietnutie analytických ani marketingových cookies nemá vplyv na možnosť objednať si jedlo.',
          },
        ],
      },
      {
        title: '9. Bezpečnosť',
        paragraphs: [
          'Prijali sme primerané technické a organizačné opatrenia na ochranu osobných údajov pred neoprávneným prístupom, zneužitím, stratou alebo zničením. Prenos údajov je šifrovaný protokolom TLS.',
        ],
      },
      {
        title: '10. Zmeny zásad',
        paragraphs: [
          'Vyhradzujeme si právo tieto zásady kedykoľvek aktualizovať. O významných zmenách Vás budeme informovať prostredníctvom našej webovej stránky.',
        ],
      },
    ],
  },
  pl: {
    sections: [
      {
        title: '1. Wprowadzenie',
        paragraphs: [
          'Niniejsza polityka opisuje, w jaki sposób przetwarzamy dane osobowe osób odwiedzających stronę internetową oraz klientów pizzerii Pizza Pohoda. Ochrona Twoich danych osobowych jest dla nas ważna i zobowiązujemy się przetwarzać je odpowiedzialnie, zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).',
        ],
      },
      {
        title: '2. Administrator danych',
        items: [
          { term: 'Nazwa:', text: '{legalName}' },
          { term: 'Siedziba:', text: '{address}, Słowacja' },
          { term: 'Numer identyfikacyjny (IČO):', text: '{ico}' },
          { term: 'Numer podatkowy (DIČ):', text: '{dic}' },
          { term: 'E-mail:', text: '{email}' },
          { term: 'Telefon:', text: '{phone}' },
        ],
        paragraphs: [
          'Nie powołaliśmy Inspektora Ochrony Danych. We wszystkich sprawach dotyczących danych osobowych prosimy o kontakt pod adresem {email}.',
        ],
      },
      {
        title: '3. Jakie dane osobowe przetwarzamy',
        paragraphs: [
          'Przy składaniu zamówienia za pośrednictwem naszej strony przetwarzamy następujące dane osobowe:',
        ],
        items: [
          {
            term: 'Imię i nazwisko',
            text: '— w celu identyfikacji zamówienia',
          },
          { term: 'Adres dostawy', text: '— miejscowość i numer domu' },
          {
            term: 'Numer telefonu',
            text: '— w celu kontaktu w sprawie zamówienia',
          },
          {
            term: 'Adres e-mail',
            text: '— w celu przesłania potwierdzenia zamówienia',
          },
          {
            term: 'Informacje o zamówieniu',
            text: '— lista produktów, cena, czas zamówienia, sposób płatności',
          },
          {
            term: 'Dane o korzystaniu ze strony',
            text: '— wyłącznie za Twoją zgodą: identyfikatory cookies, adres IP, dane o urządzeniu i przeglądarce, odwiedzone podstrony, a przy plikach marketingowych także wartość zamówienia',
          },
        ],
      },
      {
        title: '4. Cel i podstawa prawna przetwarzania',
        items: [
          {
            term: 'Realizacja zamówienia',
            text: '— wykonanie umowy, art. 6 ust. 1 lit. b) RODO',
          },
          {
            term: 'Księgowość i ewidencja podatkowa',
            text: '— obowiązek prawny, art. 6 ust. 1 lit. c) RODO',
          },
          {
            term: 'Analityka ruchu na stronie (Google Analytics)',
            text: '— zgoda, art. 6 ust. 1 lit. a) RODO, którą możesz w każdej chwili wycofać',
          },
          {
            term: 'Pomiar skuteczności reklam (Meta Pixel)',
            text: '— zgoda, art. 6 ust. 1 lit. a) RODO, którą możesz w każdej chwili wycofać',
          },
          {
            term: 'Rozpatrywanie reklamacji i dochodzenie roszczeń',
            text: '— prawnie uzasadniony interes, art. 6 ust. 1 lit. f) RODO',
          },
        ],
        paragraphs: [
          'Podanie danych jest dobrowolne, ale niezbędne do zawarcia i realizacji umowy — bez nich nie możemy przyjąć zamówienia.',
        ],
      },
      {
        title: '5. Okres przechowywania',
        items: [
          {
            term: 'Dane o zamówieniu',
            text: '— 90 dni od zrealizowania zamówienia',
          },
          {
            term: 'Dokumenty księgowe',
            text: '— 10 lat zgodnie z przepisami o rachunkowości',
          },
          {
            term: 'Dane analityczne',
            text: '— maksymalnie 14 miesięcy lub do wycofania zgody',
          },
          {
            term: 'Marketingowe pliki cookies',
            text: '— 90 dni lub do wycofania zgody',
          },
          {
            term: 'Zapis Twojego wyboru cookies',
            text: '— 12 miesięcy, potem zapytamy ponownie',
          },
        ],
        paragraphs: [
          'Po upływie okresu przechowywania dane osobowe są bezpiecznie usuwane lub anonimizowane.',
        ],
      },
      {
        title: '6. Odbiorcy danych osobowych',
        items: [
          {
            term: 'Dostawcy usług IT i hostingu',
            text: '— utrzymanie strony internetowej i bazy danych',
          },
          {
            term: 'SendGrid (Twilio Inc.)',
            text: '— wysyłka e-maili z potwierdzeniem zamówienia',
          },
          {
            term: 'Google Ireland Ltd. (Google Analytics)',
            text: '— pomiar ruchu, wyłącznie po wyrażeniu zgody',
          },
          {
            term: 'Meta Platforms Ireland Ltd. (Meta Pixel)',
            text: '— pomiar skuteczności reklam na Facebooku i Instagramie, wyłącznie po wyrażeniu zgody. W zakresie zbierania i przekazywania danych jesteśmy z Metą współadministratorami w rozumieniu art. 26 RODO; dalsze przetwarzanie regulują zasady Meta.',
          },
          {
            term: 'Cloudflare, Inc.',
            text: '— dostarczanie strony i ochrona przed atakami',
          },
          { term: 'Biuro rachunkowe', text: '— prowadzenie księgowości' },
          { term: 'Organy państwowe', text: '— jeżeli wymaga tego prawo' },
        ],
        paragraphs: [
          'Część naszych dostawców może przetwarzać dane w Stanach Zjednoczonych. Przekazanie odbywa się na podstawie decyzji Komisji Europejskiej stwierdzającej odpowiedni stopień ochrony (EU-US Data Privacy Framework) lub standardowych klauzul umownych.',
        ],
      },
      {
        title: '7. Twoje prawa',
        paragraphs: [
          'W związku z przetwarzaniem danych osobowych przysługuje Ci prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych, prawo sprzeciwu wobec przetwarzania oraz prawo do cofnięcia zgody w dowolnym momencie.',
          'Masz również prawo wniesienia skargi do organu nadzorczego — Prezes Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa.',
          'Swoje prawa możesz zrealizować pisząc na adres {email}.',
        ],
      },
      {
        title: '8. Pliki cookies',
        blocks: [
          {
            type: 'p',
            text: 'Niezbędnych plików cookies i pamięci lokalnej przeglądarki używamy bez zgody, ponieważ bez nich strona nie może działać (art. 399 ustawy z dnia 12 lipca 2024 r. Prawo komunikacji elektronicznej). Analityczne i marketingowe pliki cookies ustawiamy, a powiązane skrypty wczytujemy, dopiero po wyrażeniu przez Ciebie zgody w banerze cookies; do tego czasu nic nie jest wysyłane do Google ani do Meta.',
          },
          {
            type: 'table',
            headers: ['Nazwa', 'Kategoria', 'Cel', 'Ważność', 'Dostawca'],
            rows: [
              [
                'pohoda-cookie-consent (pamięć lokalna)',
                'Niezbędne',
                'Zapisanie Twojego wyboru cookies',
                '12 miesięcy',
                'Pizza Pohoda',
              ],
              [
                'pohoda-pizza-cart (pamięć lokalna)',
                'Niezbędne',
                'Zawartość koszyka',
                'Do opróżnienia koszyka',
                'Pizza Pohoda',
              ],
              [
                'pohoda-locale-override (pamięć sesji)',
                'Niezbędne',
                'Ręcznie wybrany język strony',
                'Do zamknięcia przeglądarki',
                'Pizza Pohoda',
              ],
              [
                'pohoda_admin',
                'Niezbędne',
                'Logowanie obsługi do panelu administracyjnego',
                '24 godziny',
                'Pizza Pohoda',
              ],
              [
                '__cf_bm i podobne',
                'Niezbędne',
                'Ochrona strony przed botami i atakami, jeśli Cloudflare ją zastosuje',
                '30 minut',
                'Cloudflare, Inc.',
              ],
              [
                '_ga, _ga_*',
                'Analityczne',
                'Rozróżnianie odwiedzających i sesji w Google Analytics',
                '2 lata',
                'Google Ireland Ltd.',
              ],
              [
                '_fbp, _fbc',
                'Marketingowe',
                'Pomiar skuteczności reklam na Facebooku i Instagramie',
                '90 dni',
                'Meta Platforms Ireland Ltd.',
              ],
            ],
          },
          {
            type: 'p',
            text: 'Zgodę możesz w każdej chwili zmienić lub wycofać przez link „Ustawienia cookies” w stopce strony głównej. Po wycofaniu zgody usuwamy pliki cookies Google Analytics i Meta Pixel. Wycofanie zgody nie wpływa na zgodność z prawem przetwarzania przed jej wycofaniem.',
          },
          {
            type: 'p',
            text: 'Odmowa zgody na analityczne ani marketingowe pliki cookies nie ogranicza możliwości złożenia zamówienia.',
          },
        ],
      },
      {
        title: '9. Bezpieczeństwo',
        paragraphs: [
          'Wdrożyliśmy odpowiednie środki techniczne i organizacyjne chroniące dane osobowe przed nieuprawnionym dostępem, nadużyciem, utratą lub zniszczeniem. Transmisja danych jest szyfrowana protokołem TLS.',
        ],
      },
      {
        title: '10. Zmiany polityki',
        paragraphs: [
          'Zastrzegamy sobie prawo do aktualizacji niniejszej polityki. O istotnych zmianach poinformujemy za pośrednictwem naszej strony internetowej.',
        ],
      },
    ],
  },
};
