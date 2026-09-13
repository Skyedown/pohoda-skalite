import React from 'react';
import { useLocale } from '../../../i18n/LocaleContext';
import './QualitySection.less';

const QualitySection: React.FC = () => {
  const { t } = useLocale();

  const cards = [
    {
      icon: '/images/quality.svg',
      title: t('quality_1_title'),
      text: t('quality_1_text'),
    },
    {
      icon: '/images/delivery.svg',
      title: t('quality_2_title'),
      text: t('quality_2_text'),
    },
    {
      icon: '/images/local.svg',
      title: t('quality_3_title'),
      text: t('quality_3_text'),
    },
  ];

  return (
    <section id="about" className="quality-section">
      <div className="container">
        <h2 className="quality-section__title">{t('quality_title')}</h2>

        <div className="quality-section__grid">
          {cards.map((card) => (
            <div className="quality-card" key={card.title}>
              <div className="quality-card__icon">
                <img src={card.icon} alt={card.title} />
              </div>
              <h3 className="quality-card__title">{card.title}</h3>
              <p className="quality-card__description">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QualitySection;
