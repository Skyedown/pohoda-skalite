import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './PrivacyPolicy.less';

const PrivacyPolicy: React.FC = () => {
  const restaurantEmail = import.meta.env.VITE_RESTAURANT_EMAIL || 'objednavky@pizzapohoda.sk';
  const restaurantPhone = import.meta.env.VITE_RESTAURANT_PHONE || '+421 918 175 571';

  return (
    <div className="privacy-policy">
      <Helmet>
        <title>Ochrana osobných údajov | Pohoda Skalite</title>
        <meta name="description" content="Zásady ochrany osobných údajov reštaurácie Pohoda Skalite" />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://pizzapohoda.sk/ochrana-osobnych-udajov" />
      </Helmet>

      {/* Close button */}
      <Link to="/" className="privacy-policy__close" aria-label="Zavrieť">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      <div className="container">
        <div className="privacy-policy__content">
          <h1 className="privacy-policy__title">Ochrana osobných údajov</h1>

          <div className="privacy-policy__section">
            <h2>1. Úvod</h2>
            <p>
              Táto stránka sa zaoberá ochranou osobných údajov návštevníkov webovej stránky a zákazníkov
              reštaurácie Pohoda Skalite (ďalej len "Pohoda" alebo "my"). Ochrana Vašich osobných údajov
              je pre nás veľmi důležitá a zaväzujeme sa, že budeme s Vašimi údajmi zaobchádzať zodpovedne
              a v súlade s platnými právnymi predpismi, najmä s Nariadením Európskeho parlamentu a Rady (EÚ)
              2016/679 o ochrane fyzických osôb pri spracúvaní osobných údajov (GDPR).
            </p>
          </div>

          <div className="privacy-policy__section">
            <h2>2. Prevádzkovateľ osobných údajov</h2>
            <p>
              <strong>Obchodné meno:</strong> Pohoda Skalite<br />
              <strong>Adresa:</strong> Skalité, Slovenská republika<br />
              <strong>Kontakt:</strong> {restaurantEmail}
            </p>
          </div>

          <div className="privacy-policy__section">
            <h2>3. Aké osobné údaje spracúvame</h2>
            <p>Pri objednávke jedla prostredníctvom našej webovej stránky spracúvame nasledujúce osobné údaje:</p>
            <ul>
              <li><strong>Meno a priezvisko</strong> - pre identifikáciu objednávky</li>
              <li><strong>Adresa doručenia</strong> - ulica, číslo domu, mesto, PSČ</li>
              <li><strong>Telefónne číslo</strong> - pre potreby kontaktovania v súvislosti s objednávkou</li>
              <li><strong>E-mailová adresa</strong> - pre zaslanie potvrdenia objednávky</li>
              <li><strong>Informácie o objednávke</strong> - zoznam objednaných produktov, cena, čas objednávky</li>
            </ul>
          </div>

          <div className="privacy-policy__section">
            <h2>4. Účel spracúvania osobných údajov</h2>
            <p>Vaše osobné údaje spracúvame na tieto účely:</p>
            <ul>
              <li>Vybavenie a doručenie Vašej objednávky</li>
              <li>Komunikácia súvisiaca s objednávkou (potvrdenie, zmeny, upozornenia)</li>
              <li>Vedenie evidencie objednávok</li>
              <li>Plnenie zákonných povinností (napr. účtovníctvo, daňová evidencia)</li>
              <li><strong>Marketingové účely</strong> - zasielanie informácií o novinkách, akciách a špeciálnych ponukách (len na základe Vašeho súhlasu)</li>
            </ul>
            <p>
              Pre marketingové účely používame Vaše kontaktné údaje (e-mail, telefón) len v prípade, že ste nám na to udelili súhlas.
              Tento súhlas môžete kedykoľvek odvolať.
            </p>
          </div>

          <div className="privacy-policy__section">
            <h2>5. Právny základ spracúvania</h2>
            <p>Vaše osobné údaje spracúvame na základe:</p>
            <ul>
              <li><strong>Plnenia zmluvy</strong> - spracúvanie je nevyhnutné pre splnenie zmluvy o dodávke jedla</li>
              <li><strong>Súhlasu dotknutej osoby</strong> - v prípade zasielania marketingových informácií</li>
              <li><strong>Plnenia zákonných povinností</strong> - účtovníctvo a daňová evidencia</li>
            </ul>
          </div>

          <div className="privacy-policy__section">
            <h2>6. Doba uchovávania osobných údajov</h2>
            <p>
              Vaše osobné údaje uchovávame len po dobu potrebnú na dosiahnutie účelu ich spracúvania:
            </p>
            <ul>
              <li><strong>Údaje o objednávke</strong> - 90 dní od vybavenia objednávky</li>
              <li><strong>Účtovné doklady</strong> - 10 rokov v súlade so zákonom o účtovníctve</li>
              <li><strong>Marketingové účely</strong> - do odvolania súhlasu alebo maximálne 3 roky od poslednej objednávky</li>
            </ul>
            <p>
              Po uplynutí doby uchovávania sú osobné údaje bezpečne vymazané alebo anonymizované.
            </p>
          </div>

          <div className="privacy-policy__section">
            <h2>7. Príjemcovia osobných údajov</h2>
            <p>Vaše osobné údaje môžeme zdieľať s nasledujúcimi kategóriami príjemcov:</p>
            <ul>
              <li><strong>Dodávatelia IT služieb</strong> - pre zabezpečenie prevádzky webovej stránky</li>
              <li><strong>Účtovníci a daňoví poradcovia</strong> - pre vedenie účtovníctva</li>
              <li><strong>Štátne orgány</strong> - ak to vyžaduje zákon</li>
            </ul>
            <p>
              Všetci sprostredkovatelia sú povinní zabezpečiť dostatočnú ochranu Vašich osobných údajov.
            </p>
          </div>

          <div className="privacy-policy__section">
            <h2>8. Vaše práva</h2>
            <p>V súvislosti so spracúvaním osobných údajov máte tieto práva:</p>
            <ul>
              <li><strong>Právo na prístup</strong> - máte právo vedieť, aké údaje o Vás spracúvame</li>
              <li><strong>Právo na opravu</strong> - máte právo požadovať opravu nesprávnych údajov</li>
              <li><strong>Právo na vymazanie</strong> - máte právo požadovať vymazanie Vašich údajov</li>
              <li><strong>Právo na obmedzenie spracúvania</strong> - môžete požadovať obmedzenie spracúvania</li>
              <li><strong>Právo na prenosnosť údajov</strong> - máte právo získať svoje údaje v strojovo čitateľnom formáte</li>
              <li><strong>Právo namietať</strong> - máte právo namietať proti spracúvaniu Vašich údajov</li>
              <li><strong>Právo odvolať súhlas</strong> - máte právo kedykoľvek odvolať súhlas so spracúvaním údajov na marketingové účely</li>
              <li><strong>Právo podať sťažnosť</strong> - máte právo podať sťažnosť na Úrad na ochranu osobných údajov SR</li>
            </ul>
            <p>
              Ak chcete uplatniť ktorékoľvek z týchto práv alebo odvolať súhlas s marketingovou komunikáciou, kontaktujte nás na: <strong>{restaurantEmail}</strong>
            </p>
          </div>

          <div className="privacy-policy__section">
            <h2>9. Bezpečnosť osobných údajov</h2>
            <p>
              Prijali sme primerané technické a organizačné opatrenia na ochranu Vašich osobných údajov
              pred neoprávneným prístupom, zneužitím, stratou alebo zničením. Naša webová stránka používa
              šifrovanie SSL/TLS na zabezpečenie prenosu údajov.
            </p>
          </div>

          <div className="privacy-policy__section">
            <h2>10. Cookies</h2>
            <p>
              Naša webová stránka používa cookies (malé textové súbory) na zlepšenie používateľskej skúsenosti.
              Cookies sa používajú výhradne na technické účely nevyhnutné pre fungovanie stránky, ako napríklad
              udržanie obsahu košíka počas návštevy.
            </p>
          </div>

          <div className="privacy-policy__section">
            <h2>11. Zmeny v zásadách ochrany osobných údajov</h2>
            <p>
              Vyhradzujeme si právo tieto zásady ochrany osobných údajov kedykoľvek aktualizovať. O významných
              zmenách Vás budeme informovať prostredníctvom našej webovej stránky.
            </p>
            <p>
              <strong>Posledná aktualizácia:</strong> {new Date().toLocaleDateString('sk-SK', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="privacy-policy__section">
            <h2>12. Kontakt</h2>
            <p>
              Ak máte akékoľvek otázky týkajúce sa ochrany osobných údajov, neváhajte nás kontaktovať:
            </p>
            <p>
              <strong>E-mail:</strong> {restaurantEmail}<br />
              <strong>Telefón:</strong> {restaurantPhone}
            </p>
          </div>

          <div className="privacy-policy__back">
            <Link to="/" className="privacy-policy__back-button">
              Späť na hlavnú stránku
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
