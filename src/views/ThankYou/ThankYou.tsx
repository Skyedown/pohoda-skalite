import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './ThankYou.less';

const ThankYou: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="thank-you">
      <Helmet>
        <title>Ďakujeme za objednávku | Pohoda Skalité</title>
      </Helmet>

      <div className="container">
        <div className="thank-you__content">
          <div className="thank-you__icon">✓</div>

          <h1 className="thank-you__title">Ďakujeme za Vašu objednávku!</h1>

          <p className="thank-you__message">
            Vaša objednávka bola úspešne prijatá a spracováva sa.
          </p>

          <p className="thank-you__info">
            Potvrdenie objednávky sme Vám poslali na email.<br />
            Budeme Vás kontaktovať v prípade akýchkoľvek otázok.
          </p>

          <div className="thank-you__details">
            <div className="thank-you__detail-item">
              <div className="thank-you__detail-icon">🍕</div>
              <div className="thank-you__detail-text">
                <strong>Príprava</strong>
                <span>Vaša objednávka sa práve pripravuje</span>
              </div>
            </div>

            <div className="thank-you__detail-item">
              <div className="thank-you__detail-icon">🚗</div>
              <div className="thank-you__detail-text">
                <strong>Donáška</strong>
                <span>Čoskoro bude na ceste k Vám</span>
              </div>
            </div>

            <div className="thank-you__detail-item">
              <div className="thank-you__detail-icon">📞</div>
              <div className="thank-you__detail-text">
                <strong>Kontakt</strong>
                <span>Voláme Vám pred doručením</span>
              </div>
            </div>
          </div>

          <Link to="/" className="thank-you__button">
            Späť na hlavnú stránku
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
