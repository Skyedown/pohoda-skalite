import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLocale } from '../../i18n/LocaleContext';
import './ThankYou.less';

const ThankYou: React.FC = () => {
  const { t } = useLocale();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const details = [
    {
      icon: '/icons/pizza.svg',
      title: t('thankyou_prep_title'),
      text: t('thankyou_prep_text'),
    },
    {
      icon: '/icons/car.svg',
      title: t('thankyou_delivery_title'),
      text: t('thankyou_delivery_text'),
    },
    {
      icon: '/icons/phone-orange.svg',
      title: t('thankyou_contact_title'),
      text: t('thankyou_contact_text'),
    },
  ];

  return (
    <div className="thank-you">
      <Helmet>
        <title>
          {t('thankyou_head_title')} | {t('seo_site_name')}
        </title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container">
        <div className="thank-you__content">
          <div className="thank-you__icon">✓</div>

          <h1 className="thank-you__title">{t('thankyou_title')}</h1>

          <p className="thank-you__message">{t('thankyou_message')}</p>

          <p className="thank-you__info">
            {t('thankyou_info_1')}
            <br />
            {t('thankyou_info_2')}
          </p>

          <div className="thank-you__details">
            {details.map((detail) => (
              <div className="thank-you__detail-item" key={detail.title}>
                <div className="thank-you__detail-icon">
                  <img src={detail.icon} alt="" aria-hidden="true" />
                </div>
                <div className="thank-you__detail-text">
                  <strong>{detail.title}</strong>
                  <span>{detail.text}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="thank-you__review-section">
            <a
              href="https://g.page/r/CdpjFWCP0ph1EBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="thank-you__review-link"
            >
              <img
                src="/google-logo.svg"
                alt="Google"
                className="thank-you__review-icon"
              />
              {t('thankyou_review')}
            </a>
          </div>

          <Link to="/" className="thank-you__button">
            {t('common_back_home')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
