import React from 'react';
import { useLocale } from '../../i18n/LocaleContext';
import { TERMS_CONTENT } from '../../legal/terms';
import { LEGAL_PATHS } from '../../legal/paths';
import LegalPage from '../LegalPage/LegalPage';

const Terms: React.FC = () => {
  const { t } = useLocale();

  return (
    <LegalPage
      content={TERMS_CONTENT}
      title={t('terms_title')}
      headTitle={`${t('terms_head_title')} | ${t('seo_site_name')}`}
      description={t('terms_head_description')}
      pathByLocale={LEGAL_PATHS.terms}
      lastUpdatedLabel={t('privacy_last_update')}
    />
  );
};

export default Terms;
