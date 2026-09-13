import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLocale } from '../../i18n/LocaleContext';
import { buildAlternates, canonicalUrl } from '../../utils/seo';
import { resolveLegalDocument } from '../../legal/render';
import type { LegalContent } from '../../legal/types';
import type { Locale } from '../../i18n/types';
import '../PrivacyPolicy/PrivacyPolicy.less';

interface LegalPageProps {
  content: LegalContent;
  title: string;
  headTitle: string;
  description: string;
  pathByLocale: Record<Locale, string>;
  lastUpdatedLabel: string;
}

const LegalPage: React.FC<LegalPageProps> = ({
  content,
  title,
  headTitle,
  description,
  pathByLocale,
  lastUpdatedLabel,
}) => {
  const { locale, t } = useLocale();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const document = useMemo(
    () => resolveLegalDocument(content[locale]),
    [content, locale],
  );

  const alternates = useMemo(
    () => buildAlternates(pathByLocale),
    [pathByLocale],
  );

  const lastUpdated = useMemo(
    () =>
      new Date(__BUILD_DATE__).toLocaleDateString(
        locale === 'pl' ? 'pl-PL' : 'sk-SK',
        { year: 'numeric', month: 'long', day: 'numeric' },
      ),
    [locale],
  );

  return (
    <div className="privacy-policy">
      <Helmet>
        <title>{headTitle}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={canonicalUrl(locale, pathByLocale[locale])}
        />
        {alternates.map((alternate) => (
          <link
            key={alternate.hrefLang}
            rel="alternate"
            hrefLang={alternate.hrefLang}
            href={alternate.href}
          />
        ))}
      </Helmet>

      <Link
        to="/"
        className="privacy-policy__close"
        aria-label={t('common_close')}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M18 6L6 18M6 6l12 12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      <div className="container">
        <div className="privacy-policy__content">
          <h1 className="privacy-policy__title">{title}</h1>

          {document.intro && (
            <div className="privacy-policy__section">
              <p>{document.intro}</p>
            </div>
          )}

          {document.sections.map((section) => (
            <div className="privacy-policy__section" key={section.title}>
              <h2>{section.title}</h2>
              {section.items && (
                <ul>
                  {section.items.map((item) => (
                    <li key={`${item.term ?? ''}${item.text}`}>
                      {item.term && <strong>{item.term}</strong>}
                      {item.term ? ' ' : ''}
                      {item.text}
                    </li>
                  ))}
                </ul>
              )}
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ))}

          <div className="privacy-policy__section">
            <p>
              <strong>{lastUpdatedLabel}</strong> {lastUpdated}
            </p>
          </div>

          <div className="privacy-policy__back">
            <Link to="/" className="privacy-policy__back-button">
              {t('common_back_home')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
