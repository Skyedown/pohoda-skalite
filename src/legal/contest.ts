import type { LegalDocument } from './types';

/** Instagram contest run from the Slovak profile, so it exists only in Slovak. */
export const CONTEST_CONTENT: LegalDocument = {
  intro: 'Účinné od 4. 11. 2026',
  sections: [
    {
      title: '1. Organizátor a účel súťaže',
      blocks: [
        {
          type: 'p',
          text: 'Organizátorom je {legalName}, {address}, IČO {ico}, prevádzkovateľ Pizza Pohoda. Kontakt: {email}, {phone}, Instagram @pizzapohoda.sk.',
        },
        {
          type: 'p',
          text: 'Súťaž podporuje značku a služby Pizza Pohoda. Tieto pravidlá sú jediným záväzným dokumentom súťaže.',
        },
        {
          type: 'p',
          text: 'Instagram ani spoločnosť Meta súťaž nesponzorujú, nespravujú ani s ňou nie sú inak spojené. Účastník poskytuje údaje organizátorovi, nie Instagramu ani spoločnosti Meta.',
        },
      ],
    },
    {
      title: '2. Trvanie a žrebovanie',
      blocks: [
        {
          type: 'p',
          text: 'Súťaž začína dňom účinnosti týchto pravidiel a trvá, kým ju organizátor neukončí. Ukončenie alebo zmenu oznámi na svojom Instagrame a na stránke s pravidlami.',
        },
        {
          type: 'p',
          text: 'Každý kalendárny mesiac je jedno súťažné kolo. Organizátor žrebuje vždy 1. deň nasledujúceho mesiaca náhodným výberom z príspevkov splnených v danom kole. V každom kole je jeden výherca.',
        },
      ],
    },
    {
      title: '3. Kto sa môže zapojiť',
      blocks: [
        {
          type: 'p',
          text: 'Zapojiť sa môže fyzická osoba, ktorá má v deň zverejnenia príspevku aspoň 18 rokov a vlastný účet na Instagrame. Zapojením účastník potvrdzuje, že má dovŕšených 18 rokov. Organizátor môže pred odovzdaním výhry požiadať o overenie veku a osoba mladšia ako 18 rokov výhru nezíska.',
        },
        {
          type: 'p',
          text: 'Zapojiť sa nemôžu zamestnanci organizátora ani ich blízke osoby podľa § 116 Občianskeho zákonníka.',
        },
      ],
    },
    {
      title: '4. Ako sa zapojiť',
      blocks: [
        {
          type: 'ol',
          items: [
            'Sleduj profil @pizzapohoda.sk na Instagrame a nechaj si ho sledovaný aj v deň žrebovania.',
            'Odfoť jedlo, ktoré si si objednal(a) od Pizza Pohoda.',
            'Fotku pridaj do Instagram Story a viditeľne označ @pizzapohoda.sk.',
          ],
        },
        {
          type: 'p',
          text: 'Story musí byť pre organizátora viditeľná počas zverejnenia. Príspevok, pri ktorom organizátor označenie nedostane alebo Story neuvidí, nemôže zaradiť do žrebovania.',
        },
        {
          type: 'p',
          text: 'Každý účastník je v jednom kole zaradený raz, aj keď pridá viac Story. Organizátor môže vyradiť príspevok s cudzím jedlom, cudzou fotkou alebo nevhodným obsahom.',
        },
      ],
    },
    {
      title: '5. Výhra a jej uplatnenie',
      blocks: [
        {
          type: 'p',
          text: 'Výhrou je poukaz na jedlo a nápoje v hodnote 30 € v Pizza Pohoda.',
        },
        {
          type: 'ul',
          items: [
            'V reštaurácii: poukaz výherca odovzdá pri platbe v prevádzke {street}.',
            'Pri donáške: výherca objednáva telefonicky na {phone} a uvedie číslo poukazu. Platí aktuálna oblasť donášky a minimálna objednávka pre danú obec.',
            'Platnosť: 3 mesiace od odovzdania, dátum je uvedený na poukaze.',
          ],
        },
        {
          type: 'p',
          text: 'Poukaz sa nedá zameniť za hotovosť. Ak je objednávka nižšia ako hodnota poukazu, rozdiel sa nevracia. Ak je vyššia, výherca rozdiel doplatí.',
        },
      ],
    },
    {
      title: '6. Oznámenie výhercu',
      blocks: [
        {
          type: 'p',
          text: 'Organizátor napíše výhercovi súkromnú správu z profilu @pizzapohoda.sk do 3 dní od žrebovania. Nikdy nebude žiadať údaje o platobnej karte ani platbu za výhru.',
        },
        {
          type: 'p',
          text: 'Výherca sa musí ozvať do 7 dní od správy. Inak výhra prepadá a organizátor môže vyžrebovať náhradníka s rovnakou lehotou. Výhru nemôže získať osoba, ktorá nespĺňa tieto pravidlá.',
        },
      ],
    },
    {
      title: '7. Osobné údaje',
      blocks: [
        {
          type: 'p',
          text: 'Prevádzkovateľom je organizátor. Spracúva Instagramové meno a obsah súťažnej Story a od výhercu aj meno, telefón, vek a pri donáške adresu.',
        },
        {
          type: 'table',
          headers: ['Účel', 'Právny základ', 'Ako dlho'],
          rows: [
            [
              'Priebeh súťaže, žrebovanie, odovzdanie výhry',
              'Plnenie zmluvy, čl. 6 ods. 1 písm. b) GDPR',
              'Do 6 mesiacov od konca kola',
            ],
            [
              'Zverejnenie Instagramového mena výhercu',
              'Oprávnený záujem, čl. 6 ods. 1 písm. f) GDPR',
              'Počas zobrazenia oznamu',
            ],
            [
              'Zverejnenie fotky alebo Story výhercu či účastníka',
              'Samostatný súhlas, čl. 6 ods. 1 písm. a) GDPR',
              'Do odvolania súhlasu',
            ],
          ],
        },
        {
          type: 'p',
          text: 'Poskytnutie údajov je podmienkou účasti a odovzdania výhry. Údaje sa neposkytujú tretím osobám, okrem dodávateľov prevádzky a prípadov, ktoré ukladajú právne predpisy.',
        },
        {
          type: 'p',
          text: 'Máš právo na prístup, opravu, vymazanie, obmedzenie spracúvania, prenosnosť údajov, námietku a odvolanie súhlasu. Práva uplatníš na {email}. Sťažnosť môžeš podať Úradu na ochranu osobných údajov SR.',
        },
      ],
    },
    {
      title: '8. Záverečné ustanovenia',
      blocks: [
        {
          type: 'p',
          text: 'Zapojením účastník súhlasí s týmito pravidlami. Organizátor môže pravidlá zmeniť alebo súťaž ukončiť; zmena platí od zverejnenia a nezasahuje do už vyžrebovaných kôl.',
        },
        {
          type: 'p',
          text: 'Sťažnosti vybavuje organizátor na {email}. Účastník sa môže obrátiť aj na subjekt alternatívneho riešenia spotrebiteľských sporov, napríklad Slovenskú obchodnú inšpekciu.',
        },
      ],
    },
  ],
};
