import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLocale } from '../../i18n/LocaleContext';
import { COMPANY } from '../../constants/company';
import { PizzaZero } from './PizzaZero/PizzaZero';
import './NotFound.less';

const NotFound: React.FC = () => {
  const { t } = useLocale();

  return (
    <section className="not-found">
      <Helmet>
        <title>{`${t('notfound_head_title')} | ${t('seo_site_name')}`}</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="not-found__content">
        <p className="not-found__code" aria-label="404">
          <span aria-hidden="true">4</span>
          <PizzaZero />
          <span aria-hidden="true">4</span>
        </p>
        <h1 className="not-found__title">{t('notfound_title')}</h1>
        <p className="not-found__text">{t('notfound_text')}</p>
        <div className="not-found__actions">
          <Link to="/" className="not-found__button">
            {t('notfound_cta_menu')}
          </Link>
          <a
            href={`tel:${COMPANY.phone}`}
            className="not-found__button not-found__button--secondary"
          >
            {t('notfound_cta_call')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
