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
            text: '— pri udelenom súhlase s analytickými cookies (anonymizovaná IP adresa, navštívené stránky)',
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
            term: 'Analytika návštevnosti',
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
        paragraphs: [
          'Technicky nevyhnutné cookies (napr. obsah košíka) používame bez súhlasu, pretože bez nich stránka nemôže fungovať. Analytické cookies nastavujeme až po Vašom súhlase udelenom v cookie lište. Súhlas môžete kedykoľvek zmeniť alebo odvolať vymazaním cookies vo Vašom prehliadači.',
          'Odmietnutie analytických cookies nemá vplyv na možnosť objednať si jedlo.',
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
            text: '— po wyrażeniu zgody na pliki cookies analityczne (zanonimizowany adres IP, odwiedzone podstrony)',
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
            term: 'Analityka ruchu na stronie',
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
        paragraphs: [
          'Pliki cookies niezbędne technicznie (np. zawartość koszyka) stosujemy bez zgody, ponieważ bez nich strona nie może działać. Pliki cookies analityczne ustawiamy dopiero po wyrażeniu przez Ciebie zgody w banerze cookies. Zgodę możesz w każdej chwili zmienić lub wycofać, usuwając pliki cookies w przeglądarce.',
          'Odmowa zgody na pliki cookies analityczne nie ogranicza możliwości złożenia zamówienia.',
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
