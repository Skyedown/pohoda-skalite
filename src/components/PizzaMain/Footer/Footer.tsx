import React from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../../i18n/LocaleContext';
import { CONTEST_PATH } from '../../../legal/paths';
import { openCookieSettings } from '../../../utils/consent';
import './Footer.less';

const Footer: React.FC = () => {
  const { locale, t } = useLocale();

  return (
    <footer className="footer">
      <div className="container">
        <nav className="footer__legal" aria-label={t('footer_legal_aria')}>
          <Link to={t('privacy_path')} className="footer__link">
            {t('privacy_title')}
          </Link>
          <span className="footer__separator" aria-hidden="true">
            ·
          </span>
          <Link to={t('terms_path')} className="footer__link">
            {t('terms_title')}
          </Link>
          {locale === 'sk' && (
            <>
              <span className="footer__separator" aria-hidden="true">
                ·
              </span>
              <Link to={CONTEST_PATH} className="footer__link">
                {t('footer_contest_link')}
              </Link>
            </>
          )}
          <span className="footer__separator" aria-hidden="true">
            ·
          </span>
          <button
            type="button"
            className="footer__link footer__link--button"
            onClick={openCookieSettings}
          >
            {t('footer_cookie_settings')}
          </button>
        </nav>
        <p className="footer__credits">
          {t('footer_created_by')}{' '}
          <a
            href="https://bemarvelousdigital.sk"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            Be Marvelous Digital
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
