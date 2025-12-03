import React from 'react';
import './QualitySection.less';

const QualitySection: React.FC = () => {
  return (
    <section id='about' className="quality-section">
      <div className="container">
        <h2 className="quality-section__title">Záleží nám na kvalite</h2>
        
        <div className="quality-section__grid">
          <div className="quality-card">
            <div className="quality-card__icon">
              <img src="/images/quality.svg" alt="Kvalitné ingrediencie" />
            </div>
            <h3 className="quality-card__title">Kvalitné ingrediencie</h3>
            <p className="quality-card__description">
              Používame len tie najlepšie a najčerstvejšie suroviny pre prípravu našich jedál.
            </p>
          </div>

          <div className="quality-card">
            <div className="quality-card__icon">
              <img src="/images/delivery.svg" alt="Rýchla donáška" />
            </div>
            <h3 className="quality-card__title">Rýchla donáška</h3>
            <p className="quality-card__description">
              Doručíme vám čerstvé jedlo priamo k dverám v čo najkratšom čase.
            </p>
          </div>

          <div className="quality-card">
            <div className="quality-card__icon">
              <img src="/images/local.svg" alt="Osobný odber" />
            </div>
            <h3 className="quality-card__title">Osobný odber v Skalitom</h3>
            <p className="quality-card__description">
              Preferujete si vyzdvihnúť objednávku osobne? Radi vás privítame na našej prevádzke.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualitySection;
