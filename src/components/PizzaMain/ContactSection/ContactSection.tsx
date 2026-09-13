import React from 'react';
import { useLocale } from '../../../i18n/LocaleContext';
import { COMPANY, formatPhone } from '../../../constants/company';
import './ContactSection.less';

const ContactSection: React.FC = () => {
  const { t } = useLocale();

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2 className="contact-section__title">{t('contact_title')}</h2>

        <div className="contact-section__grid">
          <div className="contact-section__column">
            <p>{COMPANY.street}</p>
            <p>
              {COMPANY.postalCode} {COMPANY.city}
            </p>
            <p>{t('contact_country')}</p>
            <p>{COMPANY.legalName}</p>
            {COMPANY.registrationNumber && (
              <p>
                {t('contact_reg_number')} {COMPANY.registrationNumber}
              </p>
            )}
          </div>

          <div className="contact-section__column">
            <p>
              <strong>{t('contact_email_label')}</strong>{' '}
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            </p>
            <p>
              <strong>{t('contact_phone_label')}</strong>{' '}
              <a href={`tel:${COMPANY.phone}`}>{formatPhone(COMPANY.phone)}</a>
            </p>
            <div className="contact-section__social">
              <a
                href="https://www.instagram.com/pizzapohoda.sk?igsh=MWZieWI2bWRkaGFqYg%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-section__social-link"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61585409280116"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-section__social-link"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
