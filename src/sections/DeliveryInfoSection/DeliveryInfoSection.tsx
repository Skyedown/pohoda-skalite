import React from 'react';
import './DeliveryInfoSection.less';

const DeliveryInfoSection: React.FC = () => {
  return (
    <section className="delivery-info-section">
      <div className="container">
        <div className="delivery-info-section__content">
          <h2 className="delivery-info-section__title">Donáška zadarmo!</h2>
          <p className="delivery-info-section__subtitle">
            Objednajte si jedlo s rýchlou donáškou do vašej lokality
          </p>

          <div className="delivery-info-section__grid">
            <div className="delivery-info-card">
              <div className="delivery-info-card__icon">
                <img src="/icons/pizza.svg" alt="Pizza" />
              </div>
              <h3 className="delivery-info-card__title">Skalité & Čierne</h3>
              <p className="delivery-info-card__min-order">
                Minimálna objednávka: <strong>8,00 €</strong>
              </p>
              <p className="delivery-info-card__fee">
                Donáška: <strong className="delivery-info-card__free">ZADARMO</strong>
              </p>
            </div>

            <div className="delivery-info-card">
              <div className="delivery-info-card__icon">
                <img src="/icons/car.svg" alt="Delivery" />
              </div>
              <h3 className="delivery-info-card__title">Oščadnica & Svrčinovec</h3>
              <p className="delivery-info-card__min-order">
                Minimálna objednávka: <strong>30,00 €</strong>
              </p>
              <p className="delivery-info-card__fee">
                Donáška: <strong className="delivery-info-card__free">ZADARMO</strong>
              </p>
            </div>
          </div>

          <div className="delivery-info-section__note">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            <p>
              Pri objednávke nezabudnite uviesť presné mesto a adresu doručenia. Objednávky pod minimálnu sumu nie je možné odoslať.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryInfoSection;
